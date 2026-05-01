export class LoginView {
    render() {
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
    bindSubmit(handler) {
        const form = document.getElementById('login-form');
        const usernameInput = document.getElementById('login-username');
        const passwordInput = document.getElementById('login-password');
        if (!form || !usernameInput || !passwordInput) {
            return;
        }
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            handler(usernameInput.value.trim(), passwordInput.value);
        });
    }
    setLoading(isLoading, loadingText, defaultText) {
        const button = document.getElementById('login-submit');
        if (!button) {
            return;
        }
        button.disabled = isLoading;
        button.textContent = isLoading ? loadingText : defaultText;
    }
    showError(message) {
        const errorNode = document.getElementById('login-error');
        if (!errorNode) {
            return;
        }
        errorNode.classList.remove('d-none');
        errorNode.textContent = message;
    }
    clearError() {
        const errorNode = document.getElementById('login-error');
        if (!errorNode) {
            return;
        }
        errorNode.classList.add('d-none');
        errorNode.textContent = '';
    }
}
