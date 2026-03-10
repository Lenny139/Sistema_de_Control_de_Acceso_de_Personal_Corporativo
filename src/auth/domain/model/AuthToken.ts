import { ERole } from './ERole';

export interface AuthToken {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
  user: {
    id: string;
    username: string;
    role: ERole;
  };
}
