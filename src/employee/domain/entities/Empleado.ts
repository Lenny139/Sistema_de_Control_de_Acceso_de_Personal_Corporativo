import { Role } from '../../../auth/domain/entities/Role';
import { AbstractEmpleado } from './AbstractEmpleado';

export class Empleado extends AbstractEmpleado {
  constructor(id: string, nombre: string, username: string, passwordHash: string, role: Role) {
    super(id, nombre, username, passwordHash, role);
  }
}
