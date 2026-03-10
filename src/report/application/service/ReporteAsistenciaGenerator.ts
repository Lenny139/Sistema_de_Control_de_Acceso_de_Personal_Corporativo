import { ETipoAcceso } from '../../../access-record/domain/model/ETipoAcceso';
import { AbstractReporteGenerator } from '../../domain/model/AbstractReporteGenerator';
import { ReporteAsistenciaItem } from '../../domain/model/ReporteAsistenciaItem';
import {
  AsistenciaParams,
  RegistroParaReporte,
  ReporteRepositoryPort,
} from '../../domain/port/driven/repository/ReporteRepositoryPort';

type AsistenciaAgrupada = {
  empleadoId: string;
  codigoEmpleado: string;
  nombreCompleto: string;
  departamento: string;
  fecha: string;
  entrada: Date | null;
  salida: Date | null;
  registros: RegistroParaReporte[];
};

export class ReporteAsistenciaGenerator extends AbstractReporteGenerator<
  AsistenciaParams,
  ReporteAsistenciaItem[]
> {
  constructor(private readonly reporteRepository: ReporteRepositoryPort) {
    super();
  }

  protected getTipoReporte(): string {
    return 'ASISTENCIA';
  }

  protected async obtenerDatos(input: AsistenciaParams): Promise<RegistroParaReporte[]> {
    return this.reporteRepository.getRegistrosParaAsistencia(input);
  }

  protected procesarDatos(rawData: RegistroParaReporte[]): AsistenciaAgrupada[] {
    const grouped = new Map<string, AsistenciaAgrupada>();

    rawData.forEach((registro) => {
      const key = `${registro.empleadoId}__${registro.fecha}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          empleadoId: registro.empleadoId,
          codigoEmpleado: registro.codigoEmpleado,
          nombreCompleto: registro.nombreCompleto,
          departamento: registro.departamento,
          fecha: registro.fecha,
          entrada: null,
          salida: null,
          registros: [],
        });
      }

      const item = grouped.get(key)!;
      item.registros.push(registro);

      if (registro.tipo === ETipoAcceso.ENTRADA && registro.timestampRegistro) {
        if (!item.entrada || registro.timestampRegistro < item.entrada) {
          item.entrada = registro.timestampRegistro;
        }
      }

      if (registro.tipo === ETipoAcceso.SALIDA && registro.timestampRegistro) {
        if (!item.salida || registro.timestampRegistro > item.salida) {
          item.salida = registro.timestampRegistro;
        }
      }
    });

    return Array.from(grouped.values());
  }

  protected formatearResultado(processedData: AsistenciaAgrupada[]): ReporteAsistenciaItem[] {
    return processedData
      .slice()
      .sort((a, b) => {
        const dateComparison = a.fecha.localeCompare(b.fecha);
        if (dateComparison !== 0) {
          return dateComparison;
        }

        return a.nombreCompleto.localeCompare(b.nombreCompleto);
      })
      .map((item) => {
      const horasTrabajadas =
        item.entrada && item.salida
          ? Number(((item.salida.getTime() - item.entrada.getTime()) / 3600000).toFixed(2))
          : 0;

      return {
        empleadoId: item.empleadoId,
        codigoEmpleado: item.codigoEmpleado,
        nombreCompleto: item.nombreCompleto,
        departamento: item.departamento,
        fecha: item.fecha,
        horaEntrada: item.entrada ? this.toHourMinute(item.entrada) : null,
        horaSalida: item.salida ? this.toHourMinute(item.salida) : null,
        horasTrabajadas,
        registros: item.registros
          .slice()
          .sort((a, b) => {
            const left = a.timestampRegistro?.getTime() ?? 0;
            const right = b.timestampRegistro?.getTime() ?? 0;
            return left - right;
          })
          .filter((registro) => registro.tipo !== null && registro.timestampRegistro !== null)
          .map((registro) => ({
            tipo: registro.tipo as ETipoAcceso,
            hora: this.toHourMinute(registro.timestampRegistro as Date),
            puntoControl: registro.nombrePuntoControl ?? 'Sin punto de control',
          })),
      };
    });
  }

  private readonly toHourMinute = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
}
