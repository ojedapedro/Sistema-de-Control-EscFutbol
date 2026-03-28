# 🏗️ Arquitectura Técnica - QR-School-Admin

## 📐 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Login     │  │  AdminPanel  │  │  ScannerView     │   │
│  │  Component  │  │  Component   │  │  Component       │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
│         │                 │                    │             │
│         └─────────────────┴────────────────────┘             │
│                           │                                  │
│                    ┌──────▼──────┐                          │
│                    │  AuthContext │                          │
│                    │  (React)     │                          │
│                    └──────────────┘                          │
│                           │                                  │
│                    ┌──────▼──────┐                          │
│                    │  API Service │                          │
│                    │  (api.ts)    │                          │
│                    └──────────────┘                          │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS
                             │ REST API
┌────────────────────────────▼────────────────────────────────┐
│                   BACKEND (Supabase + Deno)                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │          Hono Web Server (Edge Function)             │    │
│  │                                                      │    │
│  │  ┌──────────────┐  ┌────────────┐  ┌────────────┐  │    │
│  │  │ Auth Routes  │  │  Students  │  │ Attendance │  │    │
│  │  │  - /signup   │  │  - CRUD    │  │  - Record  │  │    │
│  │  │  - /me       │  │  - /students│  │  - /attend.│  │    │
│  │  └──────────────┘  └────────────┘  └────────────┘  │    │
│  │                                                      │    │
│  │              ┌────────────────────┐                 │    │
│  │              │  Auth Middleware   │                 │    │
│  │              │  (JWT Validation)  │                 │    │
│  │              └────────────────────┘                 │    │
│  └──────────────────────┬───────────────────────────────┘    │
│                         │                                    │
│          ┌──────────────┴──────────────┐                    │
│          │                              │                    │
│  ┌───────▼────────┐          ┌─────────▼────────┐          │
│  │  Supabase Auth │          │  KV Store (DB)   │          │
│  │  - JWT Tokens  │          │  - student:*     │          │
│  │  - User Roles  │          │  - attendance:*  │          │
│  └────────────────┘          └──────────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Datos

### 1. Autenticación

```
Usuario → Login Form → signIn() → Supabase Auth
                                      ↓
                              Access Token (JWT)
                                      ↓
                              Stored in Context
                                      ↓
                        Sent in Authorization Header
```

### 2. Registro de Asistencia

```
Profesor → Activa Cámara → Escanea QR → studentId
                                            ↓
                            POST /attendance {studentId}
                                            ↓
                            Backend valida token
                                            ↓
                            Backend busca alumno en KV
                                            ↓
                    ┌───────────────────────┴──────────────────────┐
                    │                                               │
            ✅ Solvente = true                          ❌ Solvente = false
                    │                                               │
         Registra en attendance:*                    Retorna error 403
                    │                                               │
         Retorna success + datos                  Frontend muestra alerta roja
                    │
         Frontend muestra éxito verde
```

### 3. Consulta de Dashboard

```
Usuario → Selecciona fecha → GET /attendance/stats/{date}
                                            ↓
                            Backend obtiene todos los attendance:*
                                            ↓
                            Backend filtra por fecha
                                            ↓
                            Backend calcula estadísticas
                                            ↓
                            Frontend renderiza gráficos
```

## 🗄️ Modelo de Base de Datos (Key-Value Store)

### Prefijos de Keys:

```
student:{id}        → Objeto Student
attendance:{id}     → Objeto Attendance
```

### Ejemplo de Datos:

```javascript
// student:1711234567890-abc123
{
  id: "1711234567890-abc123",
  nombre: "Juan Pérez",
  grado: "5°",
  seccion: "A",
  solvente: true,
  createdAt: "2024-03-28T10:00:00.000Z"
}

// attendance:1711234598765-xyz789
{
  id: "1711234598765-xyz789",
  studentId: "1711234567890-abc123",
  studentName: "Juan Pérez",
  grado: "5°",
  seccion: "A",
  timestamp: "2024-03-28T07:30:15.123Z",
  date: "2024-03-28",
  recordedBy: "user-uuid-professor"
}
```

## 🔐 Sistema de Seguridad

### Niveles de Protección:

1. **Frontend Route Guards**:
   ```typescript
   ProtectedRoute → Verifica si hay sesión
                 → Verifica rol del usuario
                 → Redirige si no autorizado
   ```

2. **Backend Token Validation**:
   ```typescript
   Request → Extrae token de header
          → Llama a supabase.auth.getUser(token)
          → Verifica rol en user_metadata
          → Permite o rechaza operación
   ```

3. **Operaciones por Rol**:
   
   **Admin**:
   - ✅ Crear estudiantes
   - ✅ Editar estudiantes
   - ✅ Eliminar estudiantes
   - ✅ Cambiar estado de solvencia
   - ✅ Escanear QR
   - ✅ Ver dashboard

   **Profesor**:
   - ❌ Gestionar estudiantes
   - ✅ Escanear QR
   - ✅ Ver dashboard

## 📦 Dependencias Principales

### Frontend:
```json
{
  "@supabase/supabase-js": "^2.100.1",  // Cliente Supabase
  "react-router": "7.13.0",              // Navegación
  "html5-qrcode": "^2.3.8",              // Escaneo QR
  "qrcode.react": "^4.2.0",              // Generación QR
  "recharts": "2.15.2",                  // Gráficos
  "sonner": "2.0.3",                     // Notificaciones
  "lucide-react": "0.487.0"              // Iconos
}
```

### Backend (Deno):
```typescript
import { Hono } from "npm:hono"                      // Web framework
import { cors } from "npm:hono/cors"                 // CORS
import { createClient } from "npm:@supabase/supabase-js@2"  // Supabase
```

## 🚀 Optimizaciones Implementadas

1. **Lazy Loading**: Las rutas cargan componentes bajo demanda
2. **Context API**: Estado global sin prop drilling
3. **Debouncing**: En escaneo QR para evitar múltiples registros
4. **Caching**: Session token guardado en contexto
5. **Responsive Design**: Mobile-first approach

## 🔄 Ciclo de Vida de una Sesión

```
1. Login → Genera JWT → Guarda en AuthContext
                                  ↓
2. Navegación → ProtectedRoute valida JWT
                                  ↓
3. API Calls → Incluye JWT en header Authorization
                                  ↓
4. Servidor → Valida JWT con Supabase
                                  ↓
5. Logout → Limpia context → Redirige a login
```

## 📊 Rendimiento

- **Escaneo QR**: < 1 segundo por código
- **Carga de dashboard**: < 2 segundos
- **Registro de asistencia**: < 500ms
- **Generación de QR**: Instantánea

## 🧪 Testing Recomendado

### Tests Manuales:
1. ✅ Crear usuario admin
2. ✅ Crear usuario profesor
3. ✅ CRUD de estudiantes
4. ✅ Cambio de estado solvente
5. ✅ Generación de QR
6. ✅ Escaneo de QR exitoso
7. ✅ Escaneo de alumno en mora
8. ✅ Dashboard con datos
9. ✅ Exportación CSV
10. ✅ Roles y permisos

### Tests Automáticos Sugeridos:
- Unit tests para componentes
- Integration tests para API
- E2E tests para flujos completos

## 🔮 Escalabilidad

### Límites Actuales:
- KV Store de Supabase: Limitado por plan
- Edge Functions: 500ms timeout recomendado
- Cámara: Depende del dispositivo

### Para Escalar:
1. Migrar a PostgreSQL full (tablas relacionales)
2. Implementar paginación en listados
3. Cachear estadísticas frecuentes
4. Usar CDN para códigos QR
5. Implementar WebSockets para updates en tiempo real

---

## 📝 Notas de Desarrollo

- El sistema usa TypeScript para type safety
- CORS está abierto para desarrollo
- Los timestamps usan ISO 8601
- Las fechas se almacenan en UTC
- Los IDs son generados con timestamp + random

**Documentación técnica completa para desarrolladores 🚀**
