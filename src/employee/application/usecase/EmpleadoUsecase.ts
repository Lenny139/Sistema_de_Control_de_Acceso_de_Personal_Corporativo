import { NotFoundError } from '../../../shared/domain/DomainError';
import { CreateEmpleadoDto } from '../../domain/model/CreateEmpleadoDto';
import { EmpleadoFilters } from '../../domain/model/EmpleadoFilters';
import { Empleado } from '../../domain/model/Empleado';
import { UpdateEmpleadoDto } from '../../domain/model/UpdateEmpleadoDto';
import { EmpleadoServicePort } from '../../domain/port/driver/service/EmpleadoServicePort';
import { EmpleadoUsecasePort } from './EmpleadoUsecasePort';

export class EmpleadoUsecase implements EmpleadoUsecasePort {
  constructor(private readonly empleadoService: EmpleadoServicePort) {}

  async getAllEmpleados(filters?: EmpleadoFilters): Promise<Empleado[]> {
    const empleados = await this.empleadoService.getAllEmpleados(filters);

    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? (empleados.length || 1);
    const start = (page - 1) * limit;

    return empleados.slice(start, start + limit);
  }

  async getEmpleadoById(id: string): Promise<Empleado> {
    const empleado = await this.empleadoService.getEmpleadoById(id);

    if (!empleado) {
      throw new NotFoundError('Empleado no encontrado');
    }

    return empleado;
  }

  async createEmpleado(dto: CreateEmpleadoDto): Promise<Empleado> {
    return this.empleadoService.createEmpleado(dto);
  }

  async updateEmpleado(id: string, dto: UpdateEmpleadoDto): Promise<Empleado> {
    return this.empleadoService.updateEmpleado(id, dto);
  }

  async deleteEmpleado(id: string): Promise<boolean> {
    return this.empleadoService.deactivateEmpleado(id);
  }

  async searchEmpleados(query: string): Promise<Empleado[]> {
    return this.empleadoService.searchEmpleados(query);
  }
}
