import { Router } from 'express';

export abstract class ApiRouter {
  protected readonly _router = Router();

  public get router(): Router {
    return this._router;
  }

  abstract routes(): void;
}
