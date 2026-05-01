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

function populateHeaderFromAuth(authStore) {
  const user = authStore.getUser();
  if (!user) return;

  // Nombre del usuario en el header
  const userNameEls = document.querySelectorAll(
    '#guard-name, #rrhh-user-name, #admin-user-name'
  );
  userNameEls.forEach((el) => {
    if (el) el.textContent = user.username;
  });

  // Badge de rol
  const roleMap = {
    GUARDIA_SEGURIDAD: 'Guardia de Seguridad',
    GERENTE_RRHH: 'Gerente de RRHH',
    ADMINISTRADOR: 'Administrador',
    EMPLEADO: 'Empleado',
  };
  const roleBadges = document.querySelectorAll(
    '#guard-role-badge, #rrhh-role-badge, #admin-role-badge'
  );
  roleBadges.forEach((el) => {
    if (el) el.textContent = roleMap[user.role] ?? user.role;
  });
}

const themeManager = ThemeManager.getInstance();
const router = new Router();
const authStore = AuthStore.getInstance();

themeManager.init();
initI18n();

populateHeaderFromAuth(authStore);

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

const hamburger = document.getElementById('hamburger-btn');
const sidebar = document.querySelector('aside.col-lg-2');
const overlay = document.getElementById('sidebar-overlay');
if (hamburger && sidebar && overlay) {
  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('sidebar-open');
    overlay.classList.toggle('active');
  });
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('sidebar-open');
    overlay.classList.remove('active');
  });
}

if (pathname.endsWith('/index.html') || pathname === '/') {
  new LoginController(new LoginView()).init();
}

if (pathname.endsWith('/dashboard-guardia.html')) {
  router.checkAccess(['GUARDIA_SEGURIDAD']);
  const gc = new GuardiaController(new GuardiaView());
  gc.init();
  window.addEventListener('beforeunload', () => gc.destroy());
}

if (pathname.endsWith('/dashboard-rrhh.html')) {
  router.checkAccess(['GERENTE_RRHH', 'ADMINISTRADOR']);
  const rc = new RRHHController(new RRHHView());
  rc.init();
  window.addEventListener('beforeunload', () => rc.destroy());
}

if (pathname.endsWith('/dashboard-admin.html')) {
  router.checkAccess(['ADMINISTRADOR']);
  const ac = new AdminController(new AdminView());
  ac.init();
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const btn = target.closest('[data-section]');
    if (!btn) return;
    const section = btn.dataset.section;
    if (section === 'usuarios') void ac.loadUsuarios();
    if (section === 'checkpoints') void ac.loadCheckpoints();
    if (section === 'auditoria') void ac.loadAuditoria();
  });
  window.addEventListener('beforeunload', () => ac.destroy());
}

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});