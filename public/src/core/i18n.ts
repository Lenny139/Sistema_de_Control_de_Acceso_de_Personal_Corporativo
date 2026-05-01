export type Language = 'es' | 'en';

type Dictionary = Record<string, Record<Language, string>>;

const LANGUAGE_KEY = 'control-acceso-language';

const dictionary: Dictionary = {
  'app.title': { es: 'Sistema de Control de Acceso', en: 'Access Control System' },
  'login.title': { es: 'Iniciar sesión', en: 'Sign in' },
  'login.username': { es: 'Usuario', en: 'Username' },
  'login.password': { es: 'Contraseña', en: 'Password' },
  'login.submit': { es: 'Iniciar Sesión', en: 'Sign In' },
  'login.loading': { es: 'Ingresando...', en: 'Signing in...' },
  'login.error.invalidCredentials': { es: 'Credenciales incorrectas', en: 'Invalid credentials' },
  'login.noAccess': { es: 'Sin acceso a la interfaz web', en: 'No access to web interface' },
  'nav.dashboard': { es: 'Dashboard', en: 'Dashboard' },
  'btn.checkIn': { es: 'REGISTRAR ENTRADA', en: 'CHECK IN' },
  'btn.checkOut': { es: 'REGISTRAR SALIDA', en: 'CHECK OUT' },
  'btn.logout': { es: 'Logout', en: 'Logout' },
  'msg.employeePresent': { es: 'Empleado presente', en: 'Employee present' },
  'msg.employeeAbsent': { es: 'Empleado ausente', en: 'Employee absent' },
  'rrhh.employees': { es: 'Empleados', en: 'Employees' },
  'rrhh.reportAttendance': { es: 'Reporte de Asistencia', en: 'Attendance Report' },
  'rrhh.reportPunctuality': { es: 'Reporte de Puntualidad', en: 'Punctuality Report' },
  'rrhh.buildingStatus': { es: 'Estado del Edificio', en: 'Building Status' },
  'rrhh.newEmployee': { es: 'Nuevo Empleado', en: 'New Employee' },
  'rrhh.generateReport': { es: 'Generar Reporte', en: 'Generate Report' },
  'rrhh.exportCsv': { es: 'Exportar CSV', en: 'Export CSV' },
  'guard.quickRegister': { es: 'Registro rápido', en: 'Quick register' },
  'guard.searchEmployee': { es: 'Buscar empleado por ID o nombre', en: 'Search employee by ID or name' },
  'guard.checkpoint': { es: 'Punto de control', en: 'Checkpoint' },
  'guard.observaciones': { es: 'Observaciones (opcional)', en: 'Observations (optional)' },
  'guard.visitors': { es: 'Visitantes', en: 'Visitors' },
  'guard.registerVisitor': { es: 'Registrar Entrada Visitante', en: 'Register Visitor Check-in' },
  'guard.visitorsPresent': { es: 'Visitantes presentes', en: 'Visitors currently inside' },
  'guard.refreshNow': { es: 'Actualizar ahora', en: 'Refresh now' },
  'guard.totalInBuilding': { es: 'Personas en las instalaciones', en: 'People inside the building' },
  'guard.updatedSeconds': { es: 'Actualizado hace {seconds} segundos', en: 'Updated {seconds} seconds ago' },
  'guard.moreThanTenHours': { es: '+10 horas', en: '+10 hours' },
  'guard.entryAt': { es: 'Ingreso', en: 'Check-in' },
  'guard.minutesAgo': { es: 'Hace {minutes} min', en: '{minutes} min ago' },
  'guard.host': { es: 'Anfitrión', en: 'Host' },
  'guard.registerExit': { es: 'Registrar Salida', en: 'Register Check-out' },
  'guard.status.present': { es: 'PRESENTE', en: 'PRESENT' },
  'guard.status.absent': { es: 'AUSENTE', en: 'ABSENT' },
  'guard.error.selectEmployee': { es: 'Selecciona un empleado primero', en: 'Select an employee first' },
  'guard.error.selectCheckpoint': { es: 'Selecciona un punto de control', en: 'Select a checkpoint' },
  'guard.error.completeVisitorForm': { es: 'Completa los datos del visitante', en: 'Complete the visitor details' },
  'admin.userManagement': { es: 'Gestión de Usuarios', en: 'User Management' },
  'admin.checkpointManagement': { es: 'Gestión de Puntos de Control', en: 'Checkpoint Management' },
  'admin.auditLog': { es: 'Log de Auditoría', en: 'Audit Log' },
};

let currentLanguage: Language =
  (localStorage.getItem(LANGUAGE_KEY) as Language | null) ??
  (document.documentElement.lang === 'en' ? 'en' : 'es');

export const t = (key: string): string => dictionary[key]?.[currentLanguage] ?? key;

export const setLanguage = (lang: Language): void => {
  currentLanguage = lang;
  localStorage.setItem(LANGUAGE_KEY, lang);
  document.documentElement.lang = lang;
  applyTranslations();
};

export const getLanguage = (): Language => currentLanguage;

export const applyTranslations = (): void => {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-i18n]'));
  nodes.forEach((node) => {
    const key = node.dataset.i18n;
    if (!key) {
      return;
    }

    node.textContent = t(key);
  });
};

export const initI18n = (): void => {
  setLanguage(currentLanguage);
};
