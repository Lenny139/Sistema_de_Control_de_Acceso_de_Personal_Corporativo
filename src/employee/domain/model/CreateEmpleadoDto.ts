export interface CreateEmpleadoDto {
  usuarioId?: string;
  codigoEmpleado: string;
  nombre: string;
  apellido: string;
  departamento: string;
  cargo: string;
  horaInicioLaboral: string;
  horaFinLaboral: string;
}
