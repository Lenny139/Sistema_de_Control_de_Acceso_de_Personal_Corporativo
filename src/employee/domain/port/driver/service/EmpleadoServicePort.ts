import { CreateEmpleadoDto } from '../../../../domain/model/CreateEmpleadoDto';
import { EmpleadoFilters } from '../../../../domain/model/EmpleadoFilters';
import { Empleado } from '../../../../domain/model/Empleado';
import { UpdateEmpleadoDto } from '../../../../domain/model/UpdateEmpleadoDto';

export interface EmpleadoServicePort {
  createEmpleado(data: CreateEmpleadoDto): Promise<Empleado>;
  updateEmpleado(id: string, data: UpdateEmpleadoDto): Promise<Empleado>;
  deactivateEmpleado(id: string): Promise<boolean>;
  getEmpleadoById(id: string): Promise<Empleado>;
  getEmpleadoByCodigo(codigo: string): Promise<Empleado>;
  getAllEmpleados(filters?: EmpleadoFilters): Promise<Empleado[]>;
  searchEmpleados(query: string): Promise<Empleado[]>;
}
