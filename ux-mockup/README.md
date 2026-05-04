#  SecureAccess - Diseño UX/Mockup

Este es un **diseño UX completo** del Sistema de Control de Acceso de Personal Corporativo, desarrollado como prototipo interactivo con datos estáticos.

##  Contenido

El mockup incluye:

-  **Página de Login** - Autenticación con usuarios demo
-  **Dashboard Guardia** - Gestión de entrada/salida de empleados
-  **Dashboard RRHH** - Reportes de asistencia y puntualidad
-  **Dashboard Admin** - Administración del sistema completo
-  **Estilos CSS Modernos** - Diseño responsivo y profesional

##  Cómo Usar

### Opción 1: Abrir directamente en navegador

```bash
# Windows
start index.html

# Linux/Mac
open index.html
```

### Opción 2: Usar un servidor local (recomendado)

```bash
# Si tienes Python 3
python -m http.server 8000

# Si tienes Python 2
python -m SimpleHTTPServer 8000

# Si tienes Node.js con http-server
npx http-server

# Si tienes Node.js simple
node -e "require('http').createServer((req, res) => require('fs').readFile('./' + req.url.slice(1) || 'index.html', (err, data) => (res.writeHead(200), res.end(data)))).listen(3000)"
```

Luego abre: `http://localhost:3000`

##  Usuarios Demo

En la página de login puedes seleccionar cualquiera de estos usuarios:

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| `guardia01` | `password123` |  Guardia de Seguridad |
| `rrhh01` | `password123` |  Gerente de RRHH |
| `admin01` | `password123` | ‍ Administrador |
| `empleado01` | `password123` | ‍ Empleado |

##  Estructura del Diseño

```
ux-mockup/
├── index.html              # Página de login
├── guardia-dashboard.html  # Dashboard del guardia
├── rrhh-dashboard.html     # Dashboard del RRHH
├── admin-dashboard.html    # Dashboard del administrador
├── styles.css              # Estilos compartidos
└── README.md              # Este archivo
```

##  Características por Rol

###  Guardia de Seguridad

- **Dashboard Principal**: Vista en tiempo real de empleados presentes
- **Búsqueda de Empleados**: Buscar por ID o nombre
- **Registro de Acceso**: 
  - Registrar entrada de empleados
  - Registrar salida de empleados
  - Visualización de estado actual
- **Indicadores**:
  - Presentes hoy (42)
  - Ausentes (8)
  - Tardanzas (3)
  - Hora promedio check-in

###  Gerente de RRHH

- **Reportes Profesionales**:
  - Reporte de Asistencia (entrada/salida/horas trabajadas)
  - Reporte de Puntualidad (estado de puntualidad, minutos de retraso)
  - Análisis de Tardanzas (histórico y patrones)
- **Filtros Avanzados**:
  - Por departamento
  - Por rango de fechas
- **Gráficos**: Asistencia por departamento
- **Exportación**: Opción de exportar PDF
- **Estadísticas**: Presentes, ausentes, tardanzas, asistencia del mes

### ‍ Administrador

- **Gestión de Usuarios**:
  - Lista completa de usuarios del sistema
  - Estados (activo/inactivo)
  - Roles asignados
  - Acciones: Editar, Reset de contraseña, Activar/Desactivar
  
- **Puntos de Control**:
  - Administración de puntos de acceso
  - Configuración por punto
  - Ver logs de acceso
  - Estados de dispositivos

- **Registro de Auditoría**:
  - Eventos del sistema en tiempo real
  - Check-in/Check-out
  - Generación de reportes
  - Asignación de usuarios
  - Cambios de configuración
  - Intenta acceso denegado

- **Información del Sistema**:
  - Versión
  - Última actualización
  - Espacio en base de datos
  - Opciones: Backup, Reportes, Mantenimiento

##  Datos Estáticos Incluidos

### Empleados Demo

```
1. Juan Carlos López (ID: E001) - IT - Presente 08:05
2. María Fernández García (ID: E002) - RRHH - Presente 07:58
3. Roberto Mendoza Ruiz (ID: E003) - Finanzas - Presente 08:22 (Tardanza)
4. Ana Martínez Soto (ID: E004) - Marketing - Presente 08:12
5. Diego Rodríguez Castro (ID: E005) - Operaciones - Presente 08:00
```

### Departamentos

- IT (42 presentes)
- RRHH (37 presentes)
- Finanzas (39 presentes)
- Marketing (36 presentes)
- Operaciones (38 presentes)

### Puntos de Control

- Entrada Principal (Puerta automática)
- Puerta Lateral (Torniquete)
- Salida Emergencia (Puerta manual)

##  Paleta de Colores

```css
Primary: #2563eb (Azul)
Dark: #1e40af (Azul oscuro)
Success: #10b981 (Verde)
Warning: #f59e0b (Naranja)
Danger: #ef4444 (Rojo)
```

##  Elementos de Diseño

### Componentes Reutilizables

- **Cards**: Contenedores de información
- **KPI Cards**: Indicadores clave de desempeño
- **Buttons**: Botones primarios, secundarios, peligro
- **Forms**: Inputs, selects, textareas
- **Tables**: Tablas responsive con datos
- **Badges**: Etiquetas de estado
- **Modal**: Diálogos interactivos
- **Sidebar**: Navegación lateral
- **Header**: Encabezado con usuario

### Animaciones

- Hover effects en cards
- Transiciones suaves en botones
- Loading spinner
- Slide-in animations

##  Responsividad

El diseño es completamente responsivo y se adapta a:

-  Dispositivos móviles (320px+)
-  Tablets (768px+)
-  Desktops (1024px+)

##  Personalización

Para modificar el diseño:

### Cambiar Colores

Edita las variables CSS en `styles.css`:

```css
:root {
  --primary: #2563eb;
  --primary-dark: #1e40af;
  --success: #10b981;
  /* ... */
}
```

### Agregar Más Datos

Edita las tablas HTML en cada dashboard para agregar más filas con datos.

### Cambiar Textos

Busca y reemplaza directamente en los archivos HTML.

##  Próximos Pasos para Implementación Real

Este mockup es la base para la implementación real. Para implementarlo:

1. **Backend**: Conectar con tu API REST
2. **Frontend**: Reemplazar datos estáticos con llamadas AJAX
3. **Autenticación**: Implementar JWT
4. **Base de Datos**: Conectar con SQLite/PostgreSQL
5. **Real-time**: Usar WebSockets para actualizaciones en tiempo real

##  Notas Importantes

-  Este es un prototipo de UI/UX
-  Los datos son estáticos para demostración
-  La interactividad es limitada (fines educativos)
-  Diseño responsive y moderno
-  Compatible con navegadores modernos

##  Navegadores Soportados

- Chrome/Chromium (recomendado)
- Firefox
- Safari
- Edge

##  Licencia

Este diseño es parte del proyecto "Sistema de Control de Acceso de Personal Corporativo".

---

**¡Disfruta explorando el mockup del sistema!** 
