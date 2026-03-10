import { ApiRouter } from '../../../api/domain/model/ApiRouter';
import { EmpleadoService } from '../../application/service/EmpleadoService';
import { EmpleadoUsecase } from '../../application/usecase/EmpleadoUsecase';
import { EmpleadoController } from '../adapter/api/EmpleadoController';
import { EmpleadoRouter } from '../adapter/api/EmpleadoRouter';
import { EmpleadoSQLiteRepository } from '../adapter/repository/EmpleadoSQLiteRepository';

export class EmployeeFactory {
  static create(): ApiRouter {
    const empleadoRepository = new EmpleadoSQLiteRepository();
    const empleadoService = new EmpleadoService(empleadoRepository);
    const empleadoUsecase = new EmpleadoUsecase(empleadoService);
    const empleadoController = new EmpleadoController(empleadoUsecase);

    return new EmpleadoRouter(empleadoController);
  }
}
