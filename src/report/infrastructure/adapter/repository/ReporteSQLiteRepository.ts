import { SQLiteDatabase } from '../../../../api/infrastructure/adapter/database/SQLiteDatabase';
import { ETipoAcceso } from '../../../../access-record/domain/model/ETipoAcceso';
import {
  AsistenciaParams,
  PuntualidadParams,
  RegistroParaReporte,
  ReporteRepositoryPort,
} from '../../../domain/port/driven/repository/ReporteRepositoryPort';

export class ReporteSQLiteRepository implements ReporteRepositoryPort {
  private readonly db = SQLiteDatabase.getInstance();

  async getRegistrosParaAsistencia(params: AsistenciaParams): Promise<RegistroParaReporte[]> {
    const rows = this.db
      .prepare(
        `SELECT
           e.id AS empleado_id,
           e.codigo_empleado,
           e.nombre || ' ' || e.apellido AS nombre_completo,
           e.departamento,
           date(ra.timestamp_registro) AS fecha,
           ra.timestamp_registro,
           ra.tipo,
           ra.punto_control_id,
           pc.nombre AS nombre_punto_control,
           e.hora_inicio_laboral,
           e.hora_fin_laboral
         FROM registros_acceso ra
         INNER JOIN empleados e ON e.id = ra.empleado_id
         LEFT JOIN puntos_control pc ON pc.id = ra.punto_control_id
         WHERE date(ra.timestamp_registro) BETWEEN date(?) AND date(?)
           AND (? IS NULL OR e.id = ?)
           AND (? IS NULL OR e.departamento = ?)
         ORDER BY e.codigo_empleado ASC, fecha ASC, ra.timestamp_registro ASC`,
      )
      .all(
        params.fechaInicio,
        params.fechaFin,
        params.empleadoId ?? null,
        params.empleadoId ?? null,
        params.departamento ?? null,
        params.departamento ?? null,
      ) as Array<{
      empleado_id: string;
      codigo_empleado: string;
      nombre_completo: string;
      departamento: string;
      fecha: string;
      timestamp_registro: string;
      tipo: ETipoAcceso;
      punto_control_id: string | null;
      nombre_punto_control: string | null;
      hora_inicio_laboral: string;
      hora_fin_laboral: string;
    }>;

    return rows.map((row) => ({
      empleadoId: row.empleado_id,
      codigoEmpleado: row.codigo_empleado,
      nombreCompleto: row.nombre_completo,
      departamento: row.departamento,
      fecha: row.fecha,
      timestampRegistro: new Date(row.timestamp_registro),
      tipo: row.tipo,
      puntoControlId: row.punto_control_id,
      nombrePuntoControl: row.nombre_punto_control,
      horaInicioLaboral: row.hora_inicio_laboral,
      horaFinLaboral: row.hora_fin_laboral,
    }));
  }

  async getRegistrosParaPuntualidad(params: PuntualidadParams): Promise<RegistroParaReporte[]> {
    const rows = this.db
      .prepare(
        `WITH RECURSIVE fechas(fecha) AS (
           SELECT date(?)
           UNION ALL
           SELECT date(fecha, '+1 day')
           FROM fechas
           WHERE fecha < date(?)
         ),
         empleados_filtrados AS (
           SELECT *
           FROM empleados
           WHERE activo = 1
             AND (? IS NULL OR id = ?)
             AND (? IS NULL OR departamento = ?)
         )
         SELECT
           e.id AS empleado_id,
           e.codigo_empleado,
           e.nombre || ' ' || e.apellido AS nombre_completo,
           e.departamento,
           f.fecha,
           ra.timestamp_registro,
           ra.tipo,
           ra.punto_control_id,
           pc.nombre AS nombre_punto_control,
           e.hora_inicio_laboral,
           e.hora_fin_laboral
         FROM empleados_filtrados e
         CROSS JOIN fechas f
         LEFT JOIN registros_acceso ra ON ra.id = (
           SELECT r2.id
           FROM registros_acceso r2
           WHERE r2.empleado_id = e.id
             AND date(r2.timestamp_registro) = f.fecha
             AND r2.tipo = 'ENTRADA'
           ORDER BY r2.timestamp_registro ASC
           LIMIT 1
         )
         LEFT JOIN puntos_control pc ON pc.id = ra.punto_control_id
         ORDER BY e.codigo_empleado ASC, f.fecha ASC`,
      )
      .all(
        params.fechaInicio,
        params.fechaFin,
        params.empleadoId ?? null,
        params.empleadoId ?? null,
        params.departamento ?? null,
        params.departamento ?? null,
      ) as Array<{
      empleado_id: string;
      codigo_empleado: string;
      nombre_completo: string;
      departamento: string;
      fecha: string;
      timestamp_registro: string | null;
      tipo: ETipoAcceso | null;
      punto_control_id: string | null;
      nombre_punto_control: string | null;
      hora_inicio_laboral: string;
      hora_fin_laboral: string;
    }>;

    return rows.map((row) => ({
      empleadoId: row.empleado_id,
      codigoEmpleado: row.codigo_empleado,
      nombreCompleto: row.nombre_completo,
      departamento: row.departamento,
      fecha: row.fecha,
      timestampRegistro: row.timestamp_registro ? new Date(row.timestamp_registro) : null,
      tipo: row.tipo,
      puntoControlId: row.punto_control_id,
      nombrePuntoControl: row.nombre_punto_control,
      horaInicioLaboral: row.hora_inicio_laboral,
      horaFinLaboral: row.hora_fin_laboral,
    }));
  }
}
