import { logger } from '@/libs/winston';
import { loadFilesSync } from '@graphql-tools/load-files';
import path from 'path';

type TypeGraphQLResolverClass = new (...args: any[]) => any;

let loadedResolvers: TypeGraphQLResolverClass[] = [];


try {
  // Dynamically load all resolver files
  const resolverModules = loadFilesSync(path.join(__dirname, './v1/'), {
    extensions: ['ts', 'js'],
    requireMethod: require,
  });

  resolverModules.forEach((module) => {
    for (const key in module) {
      if (
        typeof module[key] === 'function' &&
        module[key].prototype &&
        module[key].prototype.constructor === module[key]
      ) {
        loadedResolvers.push(module[key] as TypeGraphQLResolverClass);
      }
    }
  });
   logger.info(`Successfully loaded GraphQL resolvers.`);
} catch (error) {
  logger.error('Error loading GraphQL resolver files:', error);
  process.exit(1);
}

export const resolvers = loadedResolvers as Function[];