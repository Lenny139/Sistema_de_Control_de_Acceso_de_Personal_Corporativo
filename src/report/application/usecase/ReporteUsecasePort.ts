import { ReporteResult } from '../../domain/model/ReporteResult';
import { ReporteAsistenciaItem } from '../../domain/model/ReporteAsistenciaItem';
import { ReportePuntualidadItem } from '../../domain/model/ReportePuntualidadItem';
import { AsistenciaParams, PuntualidadParams } from '../../domain/port/driven/repository/ReporteRepositoryPort';

export interface ReporteUsecasePort {
  generarReporteAsistencia(params: AsistenciaParams): Promise<ReporteResult<ReporteAsistenciaItem[]>>;
  generarReportePuntualidad(
    params: PuntualidadParams,
  ): Promise<ReporteResult<ReportePuntualidadItem[]>>;
}
