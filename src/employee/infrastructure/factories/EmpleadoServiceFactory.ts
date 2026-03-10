import { EmpleadoService } from '../../application/services/EmpleadoService';
import { EmpleadoServicePort } from '../../application/ports/EmpleadoServicePort';
import { SqliteEmpleadoRepository } from '../persistence/SqliteEmpleadoRepository';

export class EmpleadoServiceFactory {
  static create = (): EmpleadoServicePort => {
    const repository = new SqliteEmpleadoRepository();
    return new EmpleadoService(repository);
  };
}
