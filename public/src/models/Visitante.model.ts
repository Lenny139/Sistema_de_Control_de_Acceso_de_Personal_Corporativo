export interface Visitante {
  id: string;
  nombre: string;
  apellido: string;
  documentoIdentidad: string;
  empresa?: string;
  empleadoAnfitrionId: string;
  puntoControlId: string;
  guardiaId: string;
  horaEntrada: string;
  horaSalida?: string;
  fechaVisita: string;
  observaciones?: string;
}
