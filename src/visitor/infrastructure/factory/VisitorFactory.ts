import { ApiRouter } from '../../../api/domain/model/ApiRouter';
import { VisitanteService } from '../../application/service/VisitanteService';
import { VisitanteUsecase } from '../../application/usecase/VisitanteUsecase';
import { VisitanteController } from '../adapter/api/VisitanteController';
import { VisitanteRouter } from '../adapter/api/VisitanteRouter';
import { VisitanteSQLiteRepository } from '../adapter/repository/VisitanteSQLiteRepository';

export class VisitorFactory {
  static create(): ApiRouter {
    const repository = new VisitanteSQLiteRepository();
    const service = new VisitanteService(repository);
    const usecase = new VisitanteUsecase(service);
    const controller = new VisitanteController(usecase);

    return new VisitanteRouter(controller);
  }
}
