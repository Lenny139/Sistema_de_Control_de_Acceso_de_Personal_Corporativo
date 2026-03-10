import { ReporteAsistenciaGenerator } from '../service/ReporteAsistenciaGenerator';
import { ReportePuntualidadGenerator } from '../service/ReportePuntualidadGenerator';
import { ReporteResult } from '../../domain/model/ReporteResult';
import { ReporteAsistenciaItem } from '../../domain/model/ReporteAsistenciaItem';
import { ReportePuntualidadItem } from '../../domain/model/ReportePuntualidadItem';
import { AsistenciaParams, PuntualidadParams } from '../../domain/port/driven/repository/ReporteRepositoryPort';
import { ReporteUsecasePort } from './ReporteUsecasePort';

export class ReporteUsecase implements ReporteUsecasePort {
  constructor(
    private readonly asistenciaGenerator: ReporteAsistenciaGenerator,
    private readonly puntualidadGenerator: ReportePuntualidadGenerator,
  ) {}

  async generarReporteAsistencia(
    params: AsistenciaParams,
  ): Promise<ReporteResult<ReporteAsistenciaItem[]>> {
    return this.asistenciaGenerator.generate(params);
  }

  async generarReportePuntualidad(
    params: PuntualidadParams,
  ): Promise<ReporteResult<ReportePuntualidadItem[]>> {
    return this.puntualidadGenerator.generate(params);
  }
}
