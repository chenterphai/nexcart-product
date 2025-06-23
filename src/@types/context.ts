import { BaseContext } from '@apollo/server';
import type { Request, Response } from 'express';

export interface GraphQLContext extends BaseContext {
  token?: string;
  req: Request;
  res: Response;
}