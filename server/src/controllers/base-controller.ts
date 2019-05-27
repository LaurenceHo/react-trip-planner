import * as express from 'express';
import { BaseService } from '../services/base-service';

export interface BaseController<T extends BaseService<object>> {
  retrieve: express.RequestHandler;

  create: express.RequestHandler;

  update: express.RequestHandler;

  delete: express.RequestHandler;
}
