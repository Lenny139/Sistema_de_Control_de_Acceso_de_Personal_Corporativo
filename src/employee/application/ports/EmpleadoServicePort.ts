import { Role } from '../../../auth/domain/entities/Role';
import { Empleado } from '../../domain/entities/Empleado';

export interface CreateEmpleadoDTO {
  readonly id: string;
  readonly nombre: string;
  readonly username: string;
  readonly password: string;
  readonly role: Role;
}

export interface EmpleadoServicePort {
  create(data: CreateEmpleadoDTO): Promise<void>;
  getAll(): Promise<Empleado[]>;
}
