import { ApiRouter } from '../../../api/domain/model/ApiRouter';
import { RegistroAccesoService } from '../../application/service/RegistroAccesoService';
import { RegistroAccesoUsecase } from '../../application/usecase/RegistroAccesoUsecase';
import { RegistroAccesoController } from '../adapter/api/RegistroAccesoController';
import { RegistroAccesoRouter } from '../adapter/api/RegistroAccesoRouter';
import { RegistroAccesoSQLiteRepository } from '../adapter/repository/RegistroAccesoSQLiteRepository';

export class AccessRecordFactory {
  static create(): ApiRouter {
    const repository = new RegistroAccesoSQLiteRepository();
    const service = new RegistroAccesoService(repository);
    const usecase = new RegistroAccesoUsecase(service);
    const controller = new RegistroAccesoController(usecase);

    return new RegistroAccesoRouter(controller);
  }
}
