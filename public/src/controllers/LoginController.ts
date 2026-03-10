import { t } from '../core/i18n';
import { AuthService } from '../services/AuthService';
import { LoginView } from '../views/LoginView';

export class LoginController {
  constructor(
    private readonly view: LoginView,
    private readonly authService: AuthService = new AuthService(),
  ) {}

  public init(): void {
    this.view.render();
    this.view.bindSubmit((username, password) => {
      void this.login(username, password);
    });
  }

  public async login(username: string, password: string): Promise<void> {
    this.view.clearError();
    this.view.setLoading(true, t('login.loading'), t('login.submit'));

    try {
      const response = await this.authService.login(username, password);
      const role = response.user.role;

      if (role === 'GUARDIA_SEGURIDAD') {
        window.location.href = '/dashboard-guardia.html';
        return;
      }

      if (role === 'GERENTE_RRHH') {
        window.location.href = '/dashboard-rrhh.html';
        return;
      }

      if (role === 'ADMINISTRADOR') {
        window.location.href = '/dashboard-admin.html';
        return;
      }

      this.view.showError(t('login.noAccess'));
    } catch {
      this.view.showError(t('login.error.invalidCredentials'));
    } finally {
      this.view.setLoading(false, t('login.loading'), t('login.submit'));
    }
  }
}
