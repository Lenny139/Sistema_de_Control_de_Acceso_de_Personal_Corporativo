import { EmpleadoController } from '../http/EmpleadoController';
import { EmpleadoServiceFactory } from './EmpleadoServiceFactory';

export class EmpleadoControllerFactory {
  static create = (): EmpleadoController => {
    return new EmpleadoController(EmpleadoServiceFactory.create());
  };
}
