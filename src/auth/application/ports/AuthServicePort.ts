import { Role } from '../../domain/entities/Role';

export interface AuthPayload {
  readonly userId: string;
  readonly username: string;
  readonly role: Role;
}

export interface AuthServicePort {
  login(username: string, password: string): Promise<string>;
  verify(token: string): Promise<AuthPayload>;
}
