import { getLanguage, initI18n, setLanguage } from './core/i18n.js';
import { ThemeManager } from './core/ThemeManager.js';
import { Router } from './core/Router.js';
import { AuthStore } from './core/AuthStore.js';
import { LoginController } from './controllers/LoginController.js';
import { LoginView } from './views/LoginView.js';
import { GuardiaController } from './controllers/GuardiaController.js';
import { GuardiaView } from './views/GuardiaView.js';
import { RRHHController } from './controllers/RRHHController.js';
import { RRHHView } from './views/RRHHView.js';
import { AdminController } from './controllers/AdminController.js';
import { AdminView } from './views/AdminView.js';

const themeManager = ThemeManager.getInstance();
const router = new Router();
const authStore = AuthStore.getInstance();

themeManager.init();
initI18n();

const pathname = window.location.pathname;

const languageSelectors = Array.from(
  document.querySelectorAll('select[id$="language-select"]'),
);
languageSelectors.forEach((selector) => {
  if (selector instanceof HTMLSelectElement) {
    selector.value = getLanguage();
    selector.addEventListener('change', () => setLanguage(selector.value === 'en' ? 'en' : 'es'));
  }
});

const themeToggles = Array.from(document.querySelectorAll('button[id$="theme-toggle"]'));
themeToggles.forEach((toggle) => {
  if (toggle instanceof HTMLButtonElement) {
    toggle.addEventListener('click', () => themeManager.toggle());
  }
});

const logoutButtons = Array.from(document.querySelectorAll('button[id$="logout-btn"]'));
logoutButtons.forEach((button) => {
  if (button instanceof HTMLButtonElement) {
    button.addEventListener('click', () => {
      authStore.clear();
      router.redirectToLogin();
    });
  }
});

if (pathname.endsWith('/index.html') || pathname === '/') {
  new LoginController(new LoginView()).init();
}

if (pathname.endsWith('/dashboard-guardia.html')) {
  router.checkAccess(['GUARDIA_SEGURIDAD']);
  new GuardiaController(new GuardiaView()).init();
}

if (pathname.endsWith('/dashboard-rrhh.html')) {
  router.checkAccess(['GERENTE_RRHH', 'ADMINISTRADOR']);
  new RRHHController(new RRHHView()).init();
}

if (pathname.endsWith('/dashboard-admin.html')) {
  router.checkAccess(['ADMINISTRADOR']);
  const controller = new AdminController(new AdminView());
  controller.init();
  controller.loadUsuarios();
  controller.loadCheckpoints();
  controller.loadAuditoria();
}
