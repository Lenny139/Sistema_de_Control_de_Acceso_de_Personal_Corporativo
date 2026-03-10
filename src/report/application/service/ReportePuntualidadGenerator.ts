import { HorarioLaboral } from '../../../employee/domain/model/HorarioLaboral';
import { AbstractReporteGenerator } from '../../domain/model/AbstractReporteGenerator';
import { ReportePuntualidadItem } from '../../domain/model/ReportePuntualidadItem';
import {
  PuntualidadParams,
  RegistroParaReporte,
  ReporteRepositoryPort,
} from '../../domain/port/driven/repository/ReporteRepositoryPort';

type PuntualidadProcesada = {
  empleadoId: string;
  codigoEmpleado: string;
  nombreCompleto: string;
  departamento: string;
  fecha: string;
  horaEntrada: string | null;
  horaInicioLaboral: string;
  minutosRetraso: number;
  estadoPuntualidad: 'PUNTUAL' | 'TARDANZA' | 'AUSENTE';
};

export class ReportePuntualidadGenerator extends AbstractReporteGenerator<
  PuntualidadParams,
  ReportePuntualidadItem[]
> {
  constructor(private readonly reporteRepository: ReporteRepositoryPort) {
    super();
  }

  protected getTipoReporte(): string {
    return 'PUNTUALIDAD';
  }

  protected async obtenerDatos(input: PuntualidadParams): Promise<RegistroParaReporte[]> {
    return this.reporteRepository.getRegistrosParaPuntualidad(input);
  }

  protected procesarDatos(rawData: RegistroParaReporte[]): PuntualidadProcesada[] {
    return rawData.map((registro) => {
      const horaInicioLaboral = registro.horaInicioLaboral || '09:00';

      if (!registro.timestampRegistro) {
        return {
          empleadoId: registro.empleadoId,
          codigoEmpleado: registro.codigoEmpleado,
          nombreCompleto: registro.nombreCompleto,
          departamento: registro.departamento,
          fecha: registro.fecha,
          horaEntrada: null,
          horaInicioLaboral,
          minutosRetraso: 0,
          estadoPuntualidad: 'AUSENTE',
        };
      }

      const horaEntrada = this.toHourMinute(registro.timestampRegistro);
      const horario = new HorarioLaboral(horaInicioLaboral, registro.horaFinLaboral || '17:00');
      const minutosRetraso = horario.minutosRetraso(horaEntrada);

      return {
        empleadoId: registro.empleadoId,
        codigoEmpleado: registro.codigoEmpleado,
        nombreCompleto: registro.nombreCompleto,
        departamento: registro.departamento,
        fecha: registro.fecha,
        horaEntrada,
        horaInicioLaboral,
        minutosRetraso,
        estadoPuntualidad: minutosRetraso > 0 ? 'TARDANZA' : 'PUNTUAL',
      };
    });
  }

  protected formatearResultado(processedData: PuntualidadProcesada[]): ReportePuntualidadItem[] {
    return processedData.map((item) => ({
      empleadoId: item.empleadoId,
      codigoEmpleado: item.codigoEmpleado,
      nombreCompleto: item.nombreCompleto,
      departamento: item.departamento,
      fecha: item.fecha,
      horaEntrada: item.horaEntrada,
      horaInicioLaboral: item.horaInicioLaboral,
      esPuntual: item.estadoPuntualidad === 'PUNTUAL',
      minutosRetraso: item.minutosRetraso,
      estadoPuntualidad: item.estadoPuntualidad,
    }));
  }

  private readonly toHourMinute = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
}
