# Checklist de Criterios de Aceptación — Parcial

## CRITERIO 1 — Check-in y dashboard
- [x] Un Guardia de Seguridad busca un empleado por su ID y aparece en resultados.
- [x] El guardia registra la entrada y el empleado aparece en dashboard de presentes.
- [x] El sistema rechaza segunda entrada con ConflictError (409).

## CRITERIO 2 — Check-out
- [x] El empleado se registra a la salida y desaparece del dashboard de presentes.
- [x] El sistema rechaza salida sin entrada previa con ConflictError (409).

## CRITERIO 3 — Reporte de asistencia
- [x] Gerente RRHH consulta GET /reports/asistencia por empleado del día anterior.
- [x] Respuesta muestra hora entrada, hora salida y horas trabajadas correctas.

## CRITERIO 4 — Reporte de puntualidad con tardanza
- [x] Si el empleado llega después de horaInicioLaboral, estadoPuntualidad = TARDANZA.
- [x] minutosRetraso refleja el tiempo exacto.

## CRITERIO 5 — Seguridad RBAC
- [x] Guardia en GET /api/1.0/reports/asistencia recibe 403.
- [x] Gerente en POST /api/1.0/access-records/check-in recibe 403.
- [x] Ruta protegida sin token recibe 401.

## CRITERIO 6 — API RESTful documentada
- [x] GET http://localhost:3000/api/1.0/docs carga Swagger UI.
- [x] Endpoints principales documentados con parámetros/respuestas.
- [x] check-in/check-out persistidos de forma atómica (transaccional en repositorio SQLite).

## CRITERIO 7 — Arquitectura Hexagonal
- [x] Dominio de módulos de negocio (auth/employee/checkpoint/access-record/visitor/report/audit) sin dependencias de express/sqlite.
- [x] Puertos en domain/port definidos como interfaces/type sin implementación concreta.
- [x] Infraestructura implementa puertos del dominio.
- [x] Dominio/aplicación probados en aislamiento con mocks.

## CRITERIO 8 — Template Method
- [x] AbstractReporteGenerator define generate() como readonly arrow function.
- [x] ReporteAsistenciaGenerator y ReportePuntualidadGenerator implementan métodos abstractos requeridos.
- [x] Flujo general obtenerDatos → procesarDatos → formatearResultado vive en la clase base.

## CRITERIO 9 — Singleton EstadoEdificio
- [x] EstadoEdificioService.getInstance() retorna instancia única.
- [x] Sincronización de estado entre pestañas de la sesión mediante storage/localStorage.
- [x] Auto-refresh actualiza UI sin recargar página.

## CRITERIO 10 — Frontend MVC
- [x] models/ sin lógica de DOM.
- [x] views/ solo manipulan DOM y no consumen HTTP.
- [x] controllers/ coordinan servicios y vistas.

## CRITERIO 11 — Pruebas
- [x] npm test pasa sin errores.
- [x] Cobertura en capas de dominio/aplicación > 70% (All files: 82.86% con collectCoverageFrom enfocado en domain/application).

## CRITERIO 12 — i18n y Dark Mode
- [x] Cambio de tema funciona en login, guardia, RRHH y admin.
- [x] Cambio ES/EN actualiza UI etiquetada con data-i18n sin recargar.
