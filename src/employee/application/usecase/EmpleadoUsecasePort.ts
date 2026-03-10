import { CreateEmpleadoDto } from '../../domain/model/CreateEmpleadoDto';
import { EmpleadoFilters } from '../../domain/model/EmpleadoFilters';
import { Empleado } from '../../domain/model/Empleado';
import { UpdateEmpleadoDto } from '../../domain/model/UpdateEmpleadoDto';

export interface EmpleadoUsecasePort {
  getAllEmpleados(filters?: EmpleadoFilters): Promise<Empleado[]>;
  getEmpleadoById(id: string): Promise<Empleado>;
  createEmpleado(dto: CreateEmpleadoDto): Promise<Empleado>;
  updateEmpleado(id: string, dto: UpdateEmpleadoDto): Promise<Empleado>;
  deleteEmpleado(id: string): Promise<boolean>;
  searchEmpleados(query: string): Promise<Empleado[]>;
}
