import { AuthController } from '../http/AuthController';
import { AuthServiceFactory } from './AuthServiceFactory';

export class AuthControllerFactory {
  static create = (): AuthController => {
    return new AuthController(AuthServiceFactory.create());
  };
}
