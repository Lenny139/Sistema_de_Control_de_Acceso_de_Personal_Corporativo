import { FinderRepository } from '../../../shared/domain/repository/FinderRepository';
import { Repository } from '../../../shared/domain/repository/Repository';
import { Empleado } from '../entities/Empleado';

export interface EmpleadoRepositoryPort extends Repository<Empleado>, FinderRepository<Empleado> {
  findByUsername(username: string): Promise<Empleado | null>;
}
