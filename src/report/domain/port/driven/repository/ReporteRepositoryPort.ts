import { ETipoAcceso } from '../../../../../access-record/domain/model/ETipoAcceso';

export interface AsistenciaParams {
  empleadoId?: string;
  departamento?: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface PuntualidadParams {
  empleadoId?: string;
  departamento?: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface RegistroParaReporte {
  empleadoId: string;
  codigoEmpleado: string;
  nombreCompleto: string;
  departamento: string;
  fecha: string;
  timestampRegistro: Date | null;
  tipo: ETipoAcceso | null;
  puntoControlId: string | null;
  nombrePuntoControl: string | null;
  horaInicioLaboral: string;
  horaFinLaboral: string;
}

export interface ReporteRepositoryPort {
  getRegistrosParaAsistencia(params: AsistenciaParams): Promise<RegistroParaReporte[]>;
  getRegistrosParaPuntualidad(params: PuntualidadParams): Promise<RegistroParaReporte[]>;
}
