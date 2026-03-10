export type TipoRegistro = 'ENTRADA' | 'SALIDA';

export interface RegistroAcceso {
  id: string;
  empleadoId: string;
  puntoControlId: string;
  guardiaId: string;
  tipo: TipoRegistro;
  timestampRegistro: string;
  observaciones?: string;
}

export interface EstadoPresencia {
  empleadoId: string;
  nombre: string;
  departamento: string;
  horaIngreso: string;
  minutosEnInstalaciones: number;
}

export interface EstadoEdificio {
  presentes: EstadoPresencia[];
  visitantesPresentes: import('./Visitante.model').Visitante[];
  lastUpdate: Date | null;
  totalPresentes: number;
}
