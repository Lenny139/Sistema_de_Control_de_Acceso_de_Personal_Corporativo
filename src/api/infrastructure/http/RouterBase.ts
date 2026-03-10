import { Router } from 'express';

export abstract class RouterBase {
  protected readonly router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  readonly getRouter = (): Router => this.router;

  protected abstract initializeRoutes(): void;
}
