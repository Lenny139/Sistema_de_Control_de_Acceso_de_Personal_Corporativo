import bcrypt from 'bcryptjs';
import { DomainError } from '../../../shared/domain/errors/DomainError';
import { Empleado } from '../../domain/entities/Empleado';
import { EmpleadoRepositoryPort } from '../../domain/repository/EmpleadoRepositoryPort';
import { CreateEmpleadoDTO, EmpleadoServicePort } from '../ports/EmpleadoServicePort';

export class EmpleadoService implements EmpleadoServicePort {
  constructor(private readonly repository: EmpleadoRepositoryPort) {}

  readonly create = async (data: CreateEmpleadoDTO): Promise<void> => {
    const existing = await this.repository.findByUsername(data.username);

    if (existing) {
      throw new DomainError('El username ya está registrado');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const empleado = new Empleado(data.id, data.nombre, data.username, passwordHash, data.role);
    await this.repository.save(empleado);
  };

  readonly getAll = async (): Promise<Empleado[]> => this.repository.findAll();
}
