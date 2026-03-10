export interface ReportePuntualidadItem {
  empleadoId: string;
  codigoEmpleado: string;
  nombreCompleto: string;
  departamento: string;
  fecha: string;
  horaEntrada: string | null;
  horaInicioLaboral: string;
  esPuntual: boolean;
  minutosRetraso: number;
  estadoPuntualidad: 'PUNTUAL' | 'TARDANZA' | 'AUSENTE';
}
