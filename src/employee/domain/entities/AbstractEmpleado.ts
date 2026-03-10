import { Role } from '../../../auth/domain/entities/Role';

export abstract class AbstractEmpleado {
  protected constructor(
    protected readonly id: string,
    protected nombre: string,
    protected username: string,
    protected passwordHash: string,
    protected role: Role,
  ) {}

  readonly getId = (): string => this.id;
  readonly getNombre = (): string => this.nombre;
  readonly setNombre = (nombre: string): void => {
    this.nombre = nombre;
  };

  readonly getUsername = (): string => this.username;
  readonly getPasswordHash = (): string => this.passwordHash;
  readonly setPasswordHash = (passwordHash: string): void => {
    this.passwordHash = passwordHash;
  };

  readonly getRole = (): Role => this.role;
  readonly setRole = (role: Role): void => {
    this.role = role;
  };
}
