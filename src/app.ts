import "reflect-metadata";
import express from 'express';
import { connectToDatabase, disconnectFromDatabase } from "@/config/database";
import config from "@/config";
import { logger } from "@/libs/winston";
import helmet from "helmet";
import compression from "compression";
import limiter from "@/libs/limiter";
import type { CorsOptions } from "cors";
import cors from 'cors';

import { buildSchema } from 'type-graphql';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { resolvers } from "./controllers";
import { GraphQLContext } from "@/@types/context";
import routes from "@/routes";


const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS Error: ${origin} is not allowed by CORS`),
        false,
      );
      logger.warn(`CORS Error: ${origin} is not allowed by CORS`);
    }
  },
};

const app = express();
app.use(helmet());
app.use(limiter);
app.use(express.urlencoded({ extended: true }));
app.use(compression({
    threshold: 1024
}));

(async () => {
    try {
        await connectToDatabase();

        const schema = await buildSchema({
            resolvers: resolvers as [Function, ...Function[]]
        });

        const server = new ApolloServer<GraphQLContext>({schema});
        await server.start();

        app.use(
            '/graphql', 
            cors<cors.CorsRequest>(corsOptions),
            express.json(),
            expressMiddleware(server, {
                context: async({req, res})=> ({
                    req,
                    res
                })
            })
        );

        app.use('/v1', routes)

        app.listen(config.PORT, () => {
            console.log(`Server running on port: ${config.PORT}`)
        });
    } catch (error: any) {
        logger.error(error)
        if (config.NODE_ENV === 'production') {
        process.exit(1); 
    }
        throw new Error(`Error while starting up server.`, error)
    }
})();


const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();
    logger.info(`Server SHUTDOWN!`);
    process.exit(0);
  } catch (error) {
    logger.warn(`Error during server shutdown.`, error);
  }
};

process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);