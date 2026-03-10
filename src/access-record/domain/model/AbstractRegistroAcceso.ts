import { ETipoAcceso } from './ETipoAcceso';

export interface RegistroAccesoInterface {
  id: string;
  empleadoId: string;
  puntoControlId: string;
  guardiaId: string;
  tipo: ETipoAcceso;
  timestampRegistro: Date;
  observaciones: string | null;
  createdAt: Date;
}

export abstract class AbstractRegistroAcceso {
  private readonly id: string;
  private readonly empleadoId: string;
  private readonly puntoControlId: string;
  private readonly guardiaId: string;
  private readonly tipo: ETipoAcceso;
  private readonly timestampRegistro: Date;
  private observaciones: string | null;
  private readonly createdAt: Date;

  protected constructor(data: RegistroAccesoInterface) {
    this.id = data.id;
    this.empleadoId = data.empleadoId;
    this.puntoControlId = data.puntoControlId;
    this.guardiaId = data.guardiaId;
    this.tipo = data.tipo;
    this.timestampRegistro = data.timestampRegistro;
    this.observaciones = data.observaciones;
    this.createdAt = data.createdAt;
  }

  readonly getId = (): string => this.id;
  readonly getEmpleadoId = (): string => this.empleadoId;
  readonly getPuntoControlId = (): string => this.puntoControlId;
  readonly getGuardiaId = (): string => this.guardiaId;
  readonly getTipo = (): ETipoAcceso => this.tipo;
  readonly getTimestampRegistro = (): Date => this.timestampRegistro;
  readonly getObservaciones = (): string | null => this.observaciones;
  readonly getCreatedAt = (): Date => this.createdAt;

  readonly setObservaciones = (observaciones: string | null): void => {
    this.observaciones = observaciones;
  };

  readonly getFechaStr = (): string => {
    const year = this.timestampRegistro.getFullYear();
    const month = String(this.timestampRegistro.getMonth() + 1).padStart(2, '0');
    const day = String(this.timestampRegistro.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  readonly getHoraStr = (): string => {
    const hours = String(this.timestampRegistro.getHours()).padStart(2, '0');
    const minutes = String(this.timestampRegistro.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
}
