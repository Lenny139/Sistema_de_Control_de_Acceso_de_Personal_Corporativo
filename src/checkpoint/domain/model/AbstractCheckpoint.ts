export interface CheckpointInterface {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  createdAt: Date;
}

export abstract class AbstractCheckpoint {
  private readonly id: string;
  private nombre: string;
  private descripcion?: string;
  private activo: boolean;
  private readonly createdAt: Date;

  protected constructor(data: CheckpointInterface) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.descripcion = data.descripcion;
    this.activo = data.activo;
    this.createdAt = data.createdAt;
  }

  readonly getId = (): string => this.id;
  readonly getNombre = (): string => this.nombre;
  readonly getDescripcion = (): string | undefined => this.descripcion;
  readonly getActivo = (): boolean => this.activo;
  readonly getCreatedAt = (): Date => this.createdAt;

  readonly setNombre = (nombre: string): void => {
    this.nombre = nombre;
  };

  readonly setDescripcion = (descripcion?: string): void => {
    this.descripcion = descripcion;
  };

  readonly setActivo = (activo: boolean): void => {
    this.activo = activo;
  };
}
