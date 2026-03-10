import { Router } from 'express';
import { EmpleadoRouter } from '../http/EmpleadoRouter';
import { EmpleadoControllerFactory } from './EmpleadoControllerFactory';

export class EmpleadoRouterFactory {
  static create = (): Router => {
    const router = new EmpleadoRouter(EmpleadoControllerFactory.create());
    return router.getRouter();
  };
}
