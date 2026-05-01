export interface HorarioLaboralFE {
  horaInicio: string;
  horaFin: string;
}

export interface Empleado {
  id: string;
  codigoEmpleado: string;
  nombre: string;
  apellido: string;
  departamento: string;
  cargo: string;
  horarioLaboral?: HorarioLaboralFE;
  activo: boolean;
}
