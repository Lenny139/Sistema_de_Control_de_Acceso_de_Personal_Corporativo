import { ERole } from './ERole';

export interface UsuarioInterface {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: ERole;
  activo: boolean;
  createdAt: Date;
}

export abstract class AbstractUsuario {
  private readonly id: string;
  private username: string;
  private email: string;
  private passwordHash: string;
  private readonly role: ERole;
  private activo: boolean;
  private readonly createdAt: Date;

  protected constructor(data: UsuarioInterface) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.passwordHash = data.passwordHash;
    this.role = data.role;
    this.activo = data.activo;
    this.createdAt = data.createdAt;
  }

  readonly getId = (): string => this.id;
  readonly getUsername = (): string => this.username;
  readonly setUsername = (username: string): void => {
    this.username = username;
  };

  readonly getEmail = (): string => this.email;
  readonly setEmail = (email: string): void => {
    this.email = email;
  };

  readonly getPasswordHash = (): string => this.passwordHash;
  readonly setPasswordHash = (passwordHash: string): void => {
    this.passwordHash = passwordHash;
  };

  readonly getRole = (): ERole => this.role;

  readonly getActivo = (): boolean => this.activo;
  readonly setActivo = (activo: boolean): void => {
    this.activo = activo;
  };

  readonly getCreatedAt = (): Date => this.createdAt;
}
