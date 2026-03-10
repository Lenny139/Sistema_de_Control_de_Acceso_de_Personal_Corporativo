export enum EAccionAudit {
  CREAR = 'CREAR',
  ACTUALIZAR = 'ACTUALIZAR',
  ELIMINAR = 'ELIMINAR',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  CHECK_IN = 'CHECK_IN',
  CHECK_OUT = 'CHECK_OUT',
  REGISTRO_VISITANTE = 'REGISTRO_VISITANTE',
  GENERAR_REPORTE = 'GENERAR_REPORTE',
}

export enum EEntidadAudit {
  USUARIO = 'USUARIO',
  EMPLEADO = 'EMPLEADO',
  CHECKPOINT = 'CHECKPOINT',
  REGISTRO_ACCESO = 'REGISTRO_ACCESO',
  VISITANTE = 'VISITANTE',
  REPORTE = 'REPORTE',
}

export interface AuditLogInterface {
  id: string;
  usuarioId: string;
  accion: EAccionAudit;
  entidad: EEntidadAudit;
  entidadId?: string;
  datosAnteriores: Record<string, unknown> | null;
  datosNuevos: Record<string, unknown> | null;
  ipAddress: string | null;
  timestamp: Date;
}

export abstract class AbstractAuditLog {
  private readonly id: string;
  private readonly usuarioId: string;
  private readonly accion: EAccionAudit;
  private readonly entidad: EEntidadAudit;
  private readonly entidadId?: string;
  private readonly datosAnteriores: Record<string, unknown> | null;
  private readonly datosNuevos: Record<string, unknown> | null;
  private readonly ipAddress: string | null;
  private readonly timestamp: Date;

  protected constructor(data: AuditLogInterface) {
    this.id = data.id;
    this.usuarioId = data.usuarioId;
    this.accion = data.accion;
    this.entidad = data.entidad;
    this.entidadId = data.entidadId;
    this.datosAnteriores = data.datosAnteriores;
    this.datosNuevos = data.datosNuevos;
    this.ipAddress = data.ipAddress;
    this.timestamp = data.timestamp;
  }

  readonly getId = (): string => this.id;
  readonly getUsuarioId = (): string => this.usuarioId;
  readonly getAccion = (): EAccionAudit => this.accion;
  readonly getEntidad = (): EEntidadAudit => this.entidad;
  readonly getEntidadId = (): string | undefined => this.entidadId;
  readonly getDatosAnteriores = (): Record<string, unknown> | null => this.datosAnteriores;
  readonly getDatosNuevos = (): Record<string, unknown> | null => this.datosNuevos;
  readonly getIpAddress = (): string | null => this.ipAddress;
  readonly getTimestamp = (): Date => this.timestamp;
}
