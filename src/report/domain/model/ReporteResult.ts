export interface ReporteResult<T> {
  tipo: string;
  fechaGeneracion: Date;
  parametros: Record<string, unknown>;
  data: T;
  totalRegistros: number;
}
