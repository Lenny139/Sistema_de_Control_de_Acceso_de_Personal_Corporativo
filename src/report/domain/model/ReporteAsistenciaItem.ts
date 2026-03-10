import { ETipoAcceso } from '../../../access-record/domain/model/ETipoAcceso';

export interface ReporteAsistenciaItem {
  empleadoId: string;
  codigoEmpleado: string;
  nombreCompleto: string;
  departamento: string;
  fecha: string;
  horaEntrada: string | null;
  horaSalida: string | null;
  horasTrabajadas: number;
  registros: {
    tipo: ETipoAcceso;
    hora: string;
    puntoControl: string;
  }[];
}
