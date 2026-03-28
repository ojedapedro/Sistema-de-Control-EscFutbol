# 🎓 QR-School-Admin - Sistema Integrado de Control de Pagos y Asistencia Escolar

## 📋 Descripción

Sistema web completo para gestionar la solvencia económica de alumnos y su asistencia diaria mediante códigos QR. Diseñado específicamente para instituciones educativas que necesitan un control eficiente de pagos y asistencia.

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- **Dos roles de usuario:**
  - **Administrador**: Control total del sistema
  - **Profesor/Monitor**: Acceso a escáner y dashboard

### 👥 Panel de Administración (Solo Admin)
- ✅ CRUD completo de alumnos (Crear, Leer, Actualizar, Eliminar)
- 💰 Gestión de estado de pago (Solvente/En Mora)
- 🎯 Generación de códigos QR únicos por alumno
- 📥 Descarga de códigos QR en formato PNG
- 📊 Vista organizada por grado y sección

### 📸 Módulo de Escaneo QR
- 📱 Activación de cámara en dispositivos móviles
- 🔍 Detección automática de códigos QR
- ✅ Validación en tiempo real del estado de solvencia
- 🚫 Bloqueo automático de alumnos en mora
- 📝 Registro instantáneo de asistencia con timestamp
- 📋 Historial de escaneos recientes

### 📊 Dashboard de Asistencia
- 📅 Filtro por fecha
- 📈 Estadísticas en tiempo real:
  - Total de alumnos
  - Presentes y ausentes
  - Porcentaje de asistencia
- 📊 Gráficos interactivos:
  - Gráfico circular de distribución
  - Gráfico de barras por grado
- 📑 Lista completa de asistencia del día
- 📥 Exportación a CSV

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **Vite** para desarrollo rápido
- **React Router** para navegación
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- **Recharts** para gráficos
- **html5-qrcode** para escaneo QR
- **qrcode.react** para generación de QR
- **Sonner** para notificaciones

### Backend
- **Supabase** (Base de datos y autenticación)
- **Hono** (Framework web ligero para Edge Functions)
- **Deno** (Runtime del servidor)

## 📁 Estructura del Proyecto

```
/src/app/
├── components/
│   └── ProtectedRoute.tsx        # Protección de rutas por rol
├── context/
│   └── AuthContext.tsx            # Contexto de autenticación
├── pages/
│   ├── Login.tsx                  # Página de inicio de sesión
│   ├── AdminPanel.tsx             # Panel administrativo
│   ├── ScannerView.tsx            # Vista de escaneo QR
│   └── Dashboard.tsx              # Dashboard de estadísticas
├── services/
│   └── api.ts                     # Servicios de API
├── routes.ts                      # Configuración de rutas
└── App.tsx                        # Componente principal

/supabase/functions/server/
├── index.tsx                      # Servidor con todas las rutas
└── kv_store.tsx                   # Utilidades de base de datos
```

## 🚀 Endpoints de la API

### Autenticación
- `POST /signup` - Crear nuevo usuario
- `GET /me` - Obtener información del usuario actual

### Estudiantes
- `GET /students` - Listar todos los estudiantes
- `GET /students/:id` - Obtener estudiante por ID
- `POST /students` - Crear estudiante (Admin)
- `PUT /students/:id` - Actualizar estudiante (Admin)
- `DELETE /students/:id` - Eliminar estudiante (Admin)

### Asistencia
- `POST /attendance` - Registrar asistencia
- `GET /attendance/:date` - Obtener asistencia por fecha
- `GET /attendance/stats/:date` - Obtener estadísticas de asistencia

## 📊 Modelo de Datos

### Estudiante (Student)
```typescript
{
  id: string,              // ID único generado automáticamente
  nombre: string,          // Nombre completo
  grado: string,           // Grado (1° - 11°)
  seccion: string,         // Sección (A, B, C, etc.)
  solvente: boolean,       // Estado de pago
  createdAt: string,       // Fecha de creación
  updatedAt?: string       // Fecha de actualización
}
```

### Registro de Asistencia (Attendance)
```typescript
{
  id: string,              // ID único del registro
  studentId: string,       // ID del estudiante
  studentName: string,     // Nombre del estudiante
  grado: string,           // Grado
  seccion: string,         // Sección
  timestamp: string,       // Hora exacta de registro
  date: string,            // Fecha (YYYY-MM-DD)
  recordedBy: string       // ID del usuario que registró
}
```

## 🎨 Diseño Visual

### Colores Institucionales
- **Azul Marino**: `#001f3f` (Color principal)
- **Blanco**: `#ffffff` (Fondo y texto)
- **Verde**: Para estados exitosos (Solvente, Presente)
- **Rojo**: Para alertas (En Mora, Ausente)

### Diseño Mobile-First
- Interfaz optimizada para dispositivos móviles
- Diseño responsivo que se adapta a tablets y desktop
- Prioridad en la experiencia del escáner móvil

## 📱 Flujo de Uso

### Primera Configuración (Administrador)
1. Crear cuenta de administrador en la página de login
2. Acceder al Panel de Administración
3. Agregar alumnos al sistema (nombre, grado, sección)
4. Generar códigos QR para cada alumno
5. Descargar e imprimir/distribuir los códigos QR

### Uso Diario (Profesor/Monitor)
1. Iniciar sesión con credenciales de profesor
2. Acceder al Escáner QR
3. Activar la cámara
4. Escanear el código QR del alumno
5. El sistema valida automáticamente:
   - ✅ Si está solvente → Registra asistencia
   - ❌ Si está en mora → Muestra alerta, no registra

### Consulta de Reportes (Admin/Profesor)
1. Acceder al Dashboard
2. Seleccionar fecha deseada
3. Ver estadísticas y gráficos
4. Exportar lista de asistencia en CSV

## 🔒 Seguridad

- Autenticación mediante Supabase Auth
- Tokens JWT para sesiones seguras
- Rutas protegidas por rol de usuario
- Validación de permisos en backend
- CORS configurado correctamente
- Service Role Key protegida en servidor

## 🌟 Ventajas del Sistema

1. **Sin contacto físico**: Sistema completamente digital
2. **Velocidad**: Registro de asistencia en menos de 1 segundo
3. **Control de pagos integrado**: Bloqueo automático de morosos
4. **Reportes instantáneos**: Estadísticas en tiempo real
5. **Escalable**: Funciona con cualquier número de alumnos
6. **Económico**: No requiere hardware especializado
7. **Móvil**: Funciona en cualquier smartphone con cámara

## 📈 Estadísticas que Proporciona

- Porcentaje de asistencia diaria
- Total de presentes y ausentes
- Asistencia desglosada por grado y sección
- Historial completo con timestamps
- Exportación de datos para análisis externo

## 🎯 Casos de Uso

1. **Control de ingreso matutino**: Registro rápido al inicio del día
2. **Control por actividad**: Verificar asistencia a eventos especiales
3. **Auditoría de pagos**: Identificar alumnos con pagos pendientes
4. **Reportes mensuales**: Exportar datos para administración
5. **Notificaciones**: Identificar patrones de ausentismo

## 💡 Próximas Mejoras Sugeridas

- 📧 Notificaciones por email a padres
- 📱 Aplicación móvil nativa
- 📊 Reportes mensuales automatizados
- 👨‍👩‍👧‍👦 Portal para padres de familia
- 💳 Integración con pasarelas de pago
- 🔔 Sistema de alertas por ausentismo
- 📸 Foto del alumno en el registro

---

## 🆘 Soporte

Para soporte técnico o consultas, contacta al administrador del sistema.

**QR-School-Admin** - Control escolar inteligente 🎓
