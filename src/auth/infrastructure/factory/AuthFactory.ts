import { ApiRouter } from '../../../api/domain/model/ApiRouter';
import { AuthService } from '../../application/service/AuthService';
import { UsuarioService } from '../../application/service/UsuarioService';
import { AuthUsecase } from '../../application/usecase/AuthUsecase';
import { AuthRouter } from '../adapter/api/AuthRouter';
import { UsuarioSQLiteRepository } from '../adapter/repository/UsuarioSQLiteRepository';

export class AuthFactory {
  static create(): ApiRouter {
    const usuarioRepository = new UsuarioSQLiteRepository();
    const authService = new AuthService(usuarioRepository);
    const usuarioService = new UsuarioService(usuarioRepository, authService);
    const authUsecase = new AuthUsecase(authService, usuarioService);

    return new AuthRouter(authUsecase);
  }
}
