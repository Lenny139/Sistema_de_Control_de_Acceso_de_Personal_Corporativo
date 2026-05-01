# Frontend Checklist

## Flujo 1 — Login
- ⚠️ Tema claro/oscuro (revisar [public/js/app.js](public/js/app.js))
- ⚠️ Selector ES/EN cambia textos (revisar [public/js/app.js](public/js/app.js))
- ⚠️ Login admin/admin123 redirige a admin (revisar [public/js/app.js](public/js/app.js))
- ⚠️ Login guardia1/guardia123 redirige a guardia (revisar [public/js/app.js](public/js/app.js))
- ⚠️ Login gerente/gerente123 redirige a RRHH (revisar [public/js/app.js](public/js/app.js))
- ⚠️ Credenciales incorrectas muestran error visible (revisar [public/src/views/LoginView.ts](public/src/views/LoginView.ts))
- ⚠️ Header muestra username real (revisar [public/js/app.js](public/js/app.js))

## Flujo 2 — Guardia
- ⚠️ Header muestra nombre y rol (revisar [public/js/app.js](public/js/app.js))
- ⚠️ Checkpoints cargan desde API (revisar [public/src/controllers/GuardiaController.ts](public/src/controllers/GuardiaController.ts))
- ⚠️ Busqueda 3+ caracteres muestra resultados (revisar [public/src/views/GuardiaView.ts](public/src/views/GuardiaView.ts))
- ⚠️ Seleccion de empleado muestra tarjeta (revisar [public/src/views/GuardiaView.ts](public/src/views/GuardiaView.ts))
- ⚠️ Estado AUSENTE muestra solo entrada (revisar [public/src/views/GuardiaView.ts](public/src/views/GuardiaView.ts))
- ⚠️ Estado PRESENTE muestra solo salida (revisar [public/src/views/GuardiaView.ts](public/src/views/GuardiaView.ts))
- ⚠️ Check-in muestra toast verde (revisar [public/src/views/GuardiaView.ts](public/src/views/GuardiaView.ts))
- ⚠️ Dashboard actualiza con check-in (revisar [public/src/controllers/GuardiaController.ts](public/src/controllers/GuardiaController.ts))
- ⚠️ Check-out muestra toast rojo (revisar [public/src/views/GuardiaView.ts](public/src/views/GuardiaView.ts))
- ⚠️ Dashboard actualiza con check-out (revisar [public/src/controllers/GuardiaController.ts](public/src/controllers/GuardiaController.ts))
- ⚠️ Auto refresh cada 30s (revisar [public/src/controllers/GuardiaController.ts](public/src/controllers/GuardiaController.ts))
- ⚠️ Boton "Actualizar ahora" fuerza refresh (revisar [public/src/views/GuardiaView.ts](public/src/views/GuardiaView.ts))
- ⚠️ Badge +10h para mas de 10h (revisar [public/src/views/GuardiaView.ts](public/src/views/GuardiaView.ts))
- ⚠️ Registro de visitante y salida (revisar [public/src/views/GuardiaView.ts](public/src/views/GuardiaView.ts))

## Flujo 3 — Gerente RRHH
- ⚠️ Sidebar navigation cambia secciones (revisar [public/src/views/RRHHView.ts](public/src/views/RRHHView.ts))
- ⚠️ Tabla empleados carga del API (revisar [public/src/controllers/RRHHController.ts](public/src/controllers/RRHHController.ts))
- ⚠️ Filtro de busqueda en tabla (revisar [public/src/views/RRHHView.ts](public/src/views/RRHHView.ts))
- ⚠️ Modal nuevo empleado abre (revisar [public/src/views/RRHHView.ts](public/src/views/RRHHView.ts))
- ⚠️ Guardar empleado crea y recarga tabla (revisar [public/src/controllers/RRHHController.ts](public/src/controllers/RRHHController.ts))
- ⚠️ Editar prellena modal (revisar [public/src/controllers/RRHHController.ts](public/src/controllers/RRHHController.ts))
- ⚠️ Desactivar con confirmacion (revisar [public/src/controllers/RRHHController.ts](public/src/controllers/RRHHController.ts))
- ⚠️ Reporte asistencia genera datos (revisar [public/src/controllers/RRHHController.ts](public/src/controllers/RRHHController.ts))
- ⚠️ Exportar CSV asistencia (revisar [public/src/controllers/RRHHController.ts](public/src/controllers/RRHHController.ts))
- ⚠️ Reporte puntualidad con badges (revisar [public/src/views/RRHHView.ts](public/src/views/RRHHView.ts))
- ⚠️ Estado del edificio en tiempo real (revisar [public/src/controllers/RRHHController.ts](public/src/controllers/RRHHController.ts))
- ⚠️ Cards del dashboard se actualizan (revisar [public/src/controllers/RRHHController.ts](public/src/controllers/RRHHController.ts))

## Flujo 4 — Administrador
- ⚠️ Usuarios del API real (revisar [public/src/controllers/AdminController.ts](public/src/controllers/AdminController.ts))
- ⚠️ Crear usuario con modal (revisar [public/src/views/AdminView.ts](public/src/views/AdminView.ts))
- ⚠️ Desactivar usuario (revisar [public/src/controllers/AdminController.ts](public/src/controllers/AdminController.ts))
- ⚠️ Checkpoints desde API (revisar [public/src/controllers/AdminController.ts](public/src/controllers/AdminController.ts))
- ⚠️ Crear checkpoint con modal (revisar [public/src/views/AdminView.ts](public/src/views/AdminView.ts))
- ⚠️ Auditoria con filtros (revisar [public/src/views/AdminView.ts](public/src/views/AdminView.ts))
- ⚠️ Secciones RRHH funcionan en Admin (revisar [public/js/app.js](public/js/app.js))

## Flujo 5 — Seguridad
- ⚠️ Acceso a RRHH sin auth redirige (revisar [public/js/app.js](public/js/app.js))
- ⚠️ Guardia accede a RRHH redirige (revisar [public/js/app.js](public/js/app.js))
- ⚠️ Token expirado redirige al login en peticiones (revisar [public/js/core/ApiClient.js](public/js/core/ApiClient.js))
