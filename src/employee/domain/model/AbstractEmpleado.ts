import { HorarioLaboral } from './HorarioLaboral';

export interface EmpleadoInterface {
  id: string;
  usuarioId?: string;
  codigoEmpleado: string;
  nombre: string;
  apellido: string;
  departamento: string;
  cargo: string;
  horarioLaboral: HorarioLaboral;
  activo: boolean;
  createdAt: Date;
}

export abstract class AbstractEmpleado {
  private readonly id: string;
  private readonly usuarioId?: string;
  private readonly codigoEmpleado: string;
  private nombre: string;
  private apellido: string;
  private departamento: string;
  private cargo: string;
  private horarioLaboral: HorarioLaboral;
  private activo: boolean;
  private readonly createdAt: Date;

  protected constructor(data: EmpleadoInterface) {
    this.id = data.id;
    this.usuarioId = data.usuarioId;
    this.codigoEmpleado = data.codigoEmpleado;
    this.nombre = data.nombre;
    this.apellido = data.apellido;
    this.departamento = data.departamento;
    this.cargo = data.cargo;
    this.horarioLaboral = data.horarioLaboral;
    this.activo = data.activo;
    this.createdAt = data.createdAt;
  }

  readonly getId = (): string => this.id;
  readonly getUsuarioId = (): string | undefined => this.usuarioId;
  readonly getCodigoEmpleado = (): string => this.codigoEmpleado;
  readonly getNombre = (): string => this.nombre;
  readonly getApellido = (): string => this.apellido;
  readonly getDepartamento = (): string => this.departamento;
  readonly getCargo = (): string => this.cargo;
  readonly getHorarioLaboral = (): HorarioLaboral => this.horarioLaboral;
  readonly getActivo = (): boolean => this.activo;
  readonly getCreatedAt = (): Date => this.createdAt;

  readonly setNombre = (nombre: string): void => {
    this.nombre = nombre;
  };

  readonly setApellido = (apellido: string): void => {
    this.apellido = apellido;
  };

  readonly setDepartamento = (departamento: string): void => {
    this.departamento = departamento;
  };

  readonly setCargo = (cargo: string): void => {
    this.cargo = cargo;
  };

  readonly setHorarioLaboral = (horarioLaboral: HorarioLaboral): void => {
    this.horarioLaboral = horarioLaboral;
  };

  readonly setActivo = (activo: boolean): void => {
    this.activo = activo;
  };

  readonly getFullName = (): string => `${this.nombre} ${this.apellido}`;
}
