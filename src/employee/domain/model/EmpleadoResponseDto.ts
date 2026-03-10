export interface EmpleadoResponseDto {
  id: string;
  codigoEmpleado: string;
  nombre: string;
  apellido: string;
  nombreCompleto: string;
  departamento: string;
  cargo: string;
  horarioLaboral: {
    inicio: string;
    fin: string;
  };
  activo: boolean;
  estaPresente?: boolean;
}
