export interface VisitanteInterface {
  id: string;
  nombre: string;
  apellido: string;
  documentoIdentidad: string;
  empresa?: string;
  empleadoAnfitrionId: string;
  guardiaId: string;
  puntoControlId: string;
  horaEntrada: Date;
  horaSalida: Date | null;
  fechaVisita: string;
  observaciones?: string;
  createdAt: Date;
}

export abstract class AbstractVisitante {
  private readonly id: string;
  private nombre: string;
  private apellido: string;
  private documentoIdentidad: string;
  private empresa?: string;
  private empleadoAnfitrionId: string;
  private guardiaId: string;
  private puntoControlId: string;
  private horaEntrada: Date;
  private horaSalida: Date | null;
  private fechaVisita: string;
  private observaciones?: string;
  private readonly createdAt: Date;

  protected constructor(data: VisitanteInterface) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.apellido = data.apellido;
    this.documentoIdentidad = data.documentoIdentidad;
    this.empresa = data.empresa;
    this.empleadoAnfitrionId = data.empleadoAnfitrionId;
    this.guardiaId = data.guardiaId;
    this.puntoControlId = data.puntoControlId;
    this.horaEntrada = data.horaEntrada;
    this.horaSalida = data.horaSalida;
    this.fechaVisita = data.fechaVisita;
    this.observaciones = data.observaciones;
    this.createdAt = data.createdAt;
  }

  readonly getId = (): string => this.id;
  readonly getNombre = (): string => this.nombre;
  readonly getApellido = (): string => this.apellido;
  readonly getDocumentoIdentidad = (): string => this.documentoIdentidad;
  readonly getEmpresa = (): string | undefined => this.empresa;
  readonly getEmpleadoAnfitrionId = (): string => this.empleadoAnfitrionId;
  readonly getGuardiaId = (): string => this.guardiaId;
  readonly getPuntoControlId = (): string => this.puntoControlId;
  readonly getHoraEntrada = (): Date => this.horaEntrada;
  readonly getHoraSalida = (): Date | null => this.horaSalida;
  readonly getFechaVisita = (): string => this.fechaVisita;
  readonly getObservaciones = (): string | undefined => this.observaciones;
  readonly getCreatedAt = (): Date => this.createdAt;

  readonly setNombre = (nombre: string): void => {
    this.nombre = nombre;
  };

  readonly setApellido = (apellido: string): void => {
    this.apellido = apellido;
  };

  readonly setDocumentoIdentidad = (documentoIdentidad: string): void => {
    this.documentoIdentidad = documentoIdentidad;
  };

  readonly setEmpresa = (empresa?: string): void => {
    this.empresa = empresa;
  };

  readonly setEmpleadoAnfitrionId = (empleadoAnfitrionId: string): void => {
    this.empleadoAnfitrionId = empleadoAnfitrionId;
  };

  readonly setGuardiaId = (guardiaId: string): void => {
    this.guardiaId = guardiaId;
  };

  readonly setPuntoControlId = (puntoControlId: string): void => {
    this.puntoControlId = puntoControlId;
  };

  readonly setHoraEntrada = (horaEntrada: Date): void => {
    this.horaEntrada = horaEntrada;
  };

  readonly setHoraSalida = (horaSalida: Date | null): void => {
    this.horaSalida = horaSalida;
  };

  readonly setFechaVisita = (fechaVisita: string): void => {
    this.fechaVisita = fechaVisita;
  };

  readonly setObservaciones = (observaciones?: string): void => {
    this.observaciones = observaciones;
  };

  readonly isPresente = (): boolean => this.horaSalida === null;

  readonly getFullName = (): string => `${this.nombre} ${this.apellido}`;

  readonly getDuracionVisitaMinutos = (): number | null => {
    if (!this.horaSalida) {
      return null;
    }

    return Math.max(0, Math.floor((this.horaSalida.getTime() - this.horaEntrada.getTime()) / 60000));
  };
}
