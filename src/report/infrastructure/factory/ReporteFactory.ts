import { ApiRouter } from '../../../api/domain/model/ApiRouter';
import { ReporteAsistenciaGenerator } from '../../application/service/ReporteAsistenciaGenerator';
import { ReportePuntualidadGenerator } from '../../application/service/ReportePuntualidadGenerator';
import { ReporteUsecase } from '../../application/usecase/ReporteUsecase';
import { ReporteController } from '../adapter/api/ReporteController';
import { ReporteRouter } from '../adapter/api/ReporteRouter';
import { ReporteSQLiteRepository } from '../adapter/repository/ReporteSQLiteRepository';

export class ReporteFactory {
  static create(): ApiRouter {
    const repository = new ReporteSQLiteRepository();
    const asistenciaGenerator = new ReporteAsistenciaGenerator(repository);
    const puntualidadGenerator = new ReportePuntualidadGenerator(repository);
    const usecase = new ReporteUsecase(asistenciaGenerator, puntualidadGenerator);
    const controller = new ReporteController(usecase);

    return new ReporteRouter(controller);
  }
}
