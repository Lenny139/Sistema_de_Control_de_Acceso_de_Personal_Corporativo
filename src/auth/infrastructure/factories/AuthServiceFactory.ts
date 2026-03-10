import bcrypt from 'bcryptjs';
import { AuthService } from '../../application/services/AuthService';
import { AuthServicePort } from '../../application/ports/AuthServicePort';
import { Role } from '../../domain/entities/Role';
import { JwtService } from '../security/JwtService';
import { SqliteEmpleadoRepository } from '../../../employee/infrastructure/persistence/SqliteEmpleadoRepository';
import { Empleado } from '../../../employee/domain/entities/Empleado';

export class AuthServiceFactory {
  static create = (): AuthServicePort => {
    const empleadoRepository = new SqliteEmpleadoRepository();
    const jwtService = new JwtService();

    this.seedAdmin(empleadoRepository).catch(() => undefined);

    return new AuthService(empleadoRepository, jwtService);
  };

  private static readonly seedAdmin = async (
    repository: SqliteEmpleadoRepository,
  ): Promise<void> => {
    const existing = await repository.findByUsername('admin');

    if (existing) {
      return;
    }

    const passwordHash = await bcrypt.hash('admin123', 10);
    const admin = new Empleado('emp-admin-001', 'Administrador General', 'admin', passwordHash, Role.ADMINISTRADOR);

    await repository.save(admin);
  };
}
