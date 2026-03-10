import { ETipoAcceso } from './ETipoAcceso';

export interface FiltrosRegistroDto {
  empleadoId?: string;
  departamento?: string;
  puntoControlId?: string;
  fechaInicio: string;
  fechaFin: string;
  tipo?: ETipoAcceso;
}
