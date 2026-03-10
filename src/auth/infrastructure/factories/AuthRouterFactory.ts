import { Router } from 'express';
import { AuthControllerFactory } from './AuthControllerFactory';
import { AuthRouter } from '../http/AuthRouter';

export class AuthRouterFactory {
  static create = (): Router => {
    const router = new AuthRouter(AuthControllerFactory.create());
    return router.getRouter();
  };
}
