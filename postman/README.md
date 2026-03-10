# Postman - Validación de Requerimientos

## Archivos
- `Parcial-Requerimientos.postman_collection.json`
- `Parcial-Requerimientos.local.postman_environment.json`

## Cómo usar
1. Levanta la API: `npm run start`
2. Importa la colección y el environment en Postman.
3. Selecciona el environment **Parcial Control Acceso - Local**.
4. Ejecuta la colección completa en orden desde el **Collection Runner**.

## Cobertura de criterios
- Cubiertos automáticamente por API/Postman: **1, 2, 3, 4, 5, 6**.
- Criterios **7-12** no son validables al 100% con Postman porque son de arquitectura, patrones, frontend y cobertura de tests; se validan con revisión de código, UI y Jest.

## Modo estricto para criterios 3 y 4
Para validar exacto (09:00, 17:00, 8 horas, TARDANZA 15 min):
1. Ejecuta el seed existente:
   - `node scripts/seed-report-data.js <EMPLEADO_ID> <CHECKPOINT_ID>`
2. En el environment pon `strictReports=true`.
3. Re-ejecuta la carpeta **03 - Criterios 3 y 4 (Reportes)**.

## Notas
- La colección toma automáticamente `empleado_id` y `checkpoint_id` en `00 - Setup`.
- Si cambias credenciales en DB, actualiza variables de environment.
