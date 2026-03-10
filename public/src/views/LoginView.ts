export class LoginView {
  public render(): void {
    const root = document.getElementById('login-root');
    if (!root) {
      return;
    }

    root.innerHTML = `
      <div class="card card-surface p-4">
        <h2 class="h5 mb-3" data-i18n="login.title">Iniciar sesión</h2>
        <form id="login-form" class="d-grid gap-3">
          <div>
            <label for="login-username" class="form-label" data-i18n="login.username">Usuario</label>
            <input id="login-username" class="form-control" type="text" required />
          </div>
          <div>
            <label for="login-password" class="form-label" data-i18n="login.password">Contraseña</label>
            <input id="login-password" class="form-control" type="password" required />
          </div>
          <div id="login-error" class="alert alert-danger d-none" role="alert"></div>
          <button id="login-submit" class="btn btn-primary" type="submit" data-i18n="login.submit">Iniciar Sesión</button>
        </form>
      </div>
    `;
  }

  public bindSubmit(handler: (username: string, password: string) => void): void {
    const form = document.getElementById('login-form') as HTMLFormElement | null;
    const usernameInput = document.getElementById('login-username') as HTMLInputElement | null;
    const passwordInput = document.getElementById('login-password') as HTMLInputElement | null;

    if (!form || !usernameInput || !passwordInput) {
      return;
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      handler(usernameInput.value.trim(), passwordInput.value);
    });
  }

  public setLoading(isLoading: boolean, loadingText: string, defaultText: string): void {
    const button = document.getElementById('login-submit') as HTMLButtonElement | null;
    if (!button) {
      return;
    }

    button.disabled = isLoading;
    button.textContent = isLoading ? loadingText : defaultText;
  }

  public showError(message: string): void {
    const errorNode = document.getElementById('login-error');
    if (!errorNode) {
      return;
    }

    errorNode.classList.remove('d-none');
    errorNode.textContent = message;
  }

  public clearError(): void {
    const errorNode = document.getElementById('login-error');
    if (!errorNode) {
      return;
    }

    errorNode.classList.add('d-none');
    errorNode.textContent = '';
  }
}
