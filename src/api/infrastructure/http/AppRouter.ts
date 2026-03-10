import { Router } from 'express';
import { AuthRouterFactory } from '../../../auth/infrastructure/factories/AuthRouterFactory';
import { EmpleadoRouterFactory } from '../../../employee/infrastructure/factories/EmpleadoRouterFactory';

export class AppRouter {
  static build = (): Router => {
    const router = Router();

    router.use('/auth', AuthRouterFactory.create());
    router.use('/employees', EmpleadoRouterFactory.create());

    return router;
  };
}
