export interface RegistrarVisitanteDto {
  nombre: string;
  apellido: string;
  documentoIdentidad: string;
  empresa?: string;
  empleadoAnfitrionId: string;
  puntoControlId: string;
  observaciones?: string;
}
