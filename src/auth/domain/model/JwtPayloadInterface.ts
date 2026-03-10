import { ERole } from './ERole';

export interface JwtPayloadInterface {
  sub: string;
  username: string;
  role: ERole;
  iat?: number;
  exp?: number;
}
