import { AbstractUsuario, UsuarioInterface } from './AbstractUsuario';

export class Usuario extends AbstractUsuario {
  constructor(data: UsuarioInterface) {
    super(data);
  }
}
