import { AbstractUsuario } from './AbstractUsuario';
import { ERole } from './ERole';

export class NullUsuario extends AbstractUsuario {
  constructor() {
    super({
      id: '',
      username: '',
      email: '',
      passwordHash: '',
      role: ERole.EMPLEADO,
      activo: false,
      createdAt: new Date(0),
    });
  }

  readonly isNull = (): boolean => true;
}
