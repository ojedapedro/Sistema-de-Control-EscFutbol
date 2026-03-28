# ❓ Preguntas Frecuentes (FAQ) - QR-School-Admin

## 🔐 Sobre el Sistema

### ¿Qué es QR-School-Admin?
Es un sistema web que permite gestionar la asistencia de alumnos mediante escaneo de códigos QR, con validación automática del estado de pago de cada estudiante.

### ¿Necesito instalar algo en mi computadora?
No. Es una aplicación web que funciona directamente desde el navegador. Solo necesitas acceso a internet.

### ¿Funciona en celulares?
Sí, está optimizado especialmente para dispositivos móviles. El escaneo QR funciona mejor en smartphones.

### ¿Qué navegadores son compatibles?
- ✅ Google Chrome (Recomendado)
- ✅ Microsoft Edge
- ✅ Safari (iOS)
- ✅ Firefox
- ⚠️ Debe soportar acceso a cámara

## 👥 Sobre Usuarios y Roles

### ¿Cuántos usuarios puedo crear?
Ilimitados. Puedes crear tantos administradores y profesores como necesites.

### ¿Cuál es la diferencia entre Admin y Profesor?

**Administrador**:
- Gestiona alumnos (crear, editar, eliminar)
- Controla estados de pago
- Genera códigos QR
- Escanea asistencia
- Ve dashboard

**Profesor/Monitor**:
- Solo escanea asistencia
- Ve dashboard
- NO puede modificar alumnos

### ¿Puedo cambiar el rol de un usuario?
Actualmente no desde la interfaz. Contacta al administrador del sistema para cambios de rol.

### ¿Qué pasa si olvido mi contraseña?
Actualmente debes contactar al administrador principal para que te cree una nueva cuenta o resetee tu contraseña.

## 👨‍🎓 Sobre Alumnos

### ¿Cuántos alumnos puedo registrar?
El sistema es escalable. Funciona igual con 50 que con 5000 alumnos.

### ¿Qué información necesito para registrar un alumno?
Solo tres datos:
1. Nombre completo
2. Grado (1° a 11°)
3. Sección (A, B, C, etc.)

### ¿Puedo editar la información de un alumno?
Sí, los administradores pueden editar nombre, grado y sección en cualquier momento.

### ¿Qué pasa si elimino un alumno por error?
Deberás crearlo nuevamente. El código QR anterior ya no funcionará. **Recomendación**: Mejor desactivar marcándolo en mora que eliminar.

## 🎫 Sobre Códigos QR

### ¿Cómo genero el código QR de un alumno?
1. Ve al Panel de Administración
2. Busca al alumno
3. Haz clic en el ícono de QR
4. Descarga la imagen

### ¿Qué tamaño debe tener el código QR impreso?
Recomendamos mínimo 5cm × 5cm. Entre más grande, mejor se escanea.

### ¿En qué material debo imprimir los códigos?
Lo ideal es:
- Impresión en papel normal o fotográfico
- Plastificado o en portacredencial
- Que no esté arrugado ni manchado

### ¿Los códigos QR expiran?
No, son permanentes. Un alumno puede usar el mismo código todo el año escolar.

### ¿Qué pasa si un alumno pierde su código QR?
El administrador puede:
1. Ver el código QR nuevamente en el sistema
2. Descargarlo otra vez
3. Imprimirlo nuevamente
El código es el mismo, no cambia.

### ¿Pueden dos alumnos tener el mismo código QR?
No, cada código es único. El sistema genera un ID irrepetible por alumno.

## 💰 Sobre Pagos y Solvencia

### ¿Cómo marco a un alumno en mora?
1. Ve al Panel de Administración
2. Busca al alumno
3. Haz clic en el botón de estado (verde/rojo)
4. Cambia de "Solvente" a "En Mora"

### ¿Qué pasa cuando un alumno está en mora?
- Su código QR sigue funcionando
- El sistema lo detecta al escanear
- Muestra alerta ROJA
- NO registra la asistencia
- El profesor es notificado visualmente

### ¿Cuándo cambio el estado a solvente nuevamente?
Cuando el alumno se ponga al día con sus pagos. El cambio es instantáneo.

### ¿El sistema envía recordatorios de pago?
No actualmente. El sistema solo bloquea el registro de asistencia.

## 📸 Sobre el Escaneo

### ¿Cómo activo la cámara?
1. Ve a la sección "Escáner"
2. Haz clic en "Activar Cámara"
3. Acepta los permisos del navegador
4. Centra el código QR en el recuadro

### La cámara no se activa, ¿qué hago?
Verifica:
- ✅ Que diste permiso al navegador
- ✅ Que estás usando HTTPS o localhost
- ✅ Que el dispositivo tiene cámara funcional
- ✅ Que ninguna otra app está usando la cámara
- 🔄 Recarga la página e intenta de nuevo

### ¿Cuánto tarda en escanear un código?
Menos de 1 segundo una vez detectado.

### ¿Puedo escanear sin internet?
No, el sistema necesita conexión para validar en tiempo real el estado de solvencia.

### ¿Qué significa cada color en el escaneo?

- 🟢 **VERDE**: Alumno solvente, asistencia registrada ✅
- 🔴 **ROJO**: Alumno en mora, NO se registró ❌
- 🟡 **AMARILLO**: Código no encontrado o inválido ⚠️

### ¿Puedo registrar asistencia manualmente?
No actualmente. Solo mediante escaneo QR para garantizar la integridad.

## 📊 Sobre el Dashboard

### ¿Qué información muestra el dashboard?
- Total de alumnos registrados
- Presentes del día
- Ausentes del día
- Porcentaje de asistencia
- Gráficos por grado
- Lista detallada con horarios

### ¿Puedo ver estadísticas de días anteriores?
Sí, usa el selector de fecha en la parte superior del dashboard.

### ¿Cómo exporto los datos?
Haz clic en "Exportar CSV" en el dashboard. Se descarga un archivo de Excel con toda la información.

### ¿Qué formato tiene el archivo exportado?
CSV (compatible con Excel, Google Sheets):
```
Nombre, Grado, Sección, Hora de Entrada
Juan Pérez, 5°, A, 07:30:15
```

## 🔧 Problemas Técnicos

### El código QR no se escanea, ¿qué hago?
1. Verifica que el código esté limpio y sin arrugas
2. Mejora la iluminación
3. Acerca o aleja el código de la cámara
4. Asegúrate de que esté bien enfocado
5. Si el código está muy deteriorado, genera uno nuevo

### Veo un error "Unauthorized", ¿qué significa?
Tu sesión expiró. Cierra sesión y vuelve a iniciar sesión.

### Los datos no se guardan, ¿por qué?
Verifica:
- Tu conexión a internet
- Que tu sesión no haya expirado
- Que tienes los permisos necesarios (Admin para crear/editar)

### ¿Qué hago si el sistema está lento?
- Verifica tu conexión a internet
- Recarga la página (F5)
- Limpia el caché del navegador
- Intenta con otro navegador

## 📱 Sobre el Uso Diario

### ¿A qué hora debo activar el escáner?
Recomendamos 10 minutos antes de la hora de entrada de los alumnos.

### ¿Puedo tener varios dispositivos escaneando al mismo tiempo?
Sí, puedes tener múltiples profesores escaneando simultáneamente en diferentes puntos.

### ¿Qué pasa si escaneo el mismo alumno dos veces?
El sistema registra cada escaneo con su timestamp. Puedes ver el historial completo.

### ¿Puedo modificar un registro de asistencia?
No directamente desde la interfaz. Los registros son permanentes para mantener integridad.

## 💾 Sobre Datos y Respaldos

### ¿Dónde se almacenan mis datos?
En servidores seguros de Supabase (base de datos en la nube).

### ¿Están seguros mis datos?
Sí, Supabase cuenta con:
- Cifrado de datos
- Backups automáticos
- Servidores certificados
- Cumplimiento de estándares de seguridad

### ¿Puedo hacer backup de mis datos?
Sí, exporta regularmente los CSV desde el dashboard.

### ¿Cuánto tiempo se guardan los registros?
Permanentemente, a menos que elimines manualmente.

## 💡 Consejos y Mejores Prácticas

### ¿Cuántos dispositivos necesito?
Depende del tamaño de tu institución:
- **Pequeña (< 200 alumnos)**: 1 dispositivo suficiente
- **Mediana (200-500)**: 2-3 dispositivos
- **Grande (> 500)**: 3-5 dispositivos en diferentes puntos

### ¿Qué tipo de dispositivo es mejor?
Cualquier smartphone moderno con:
- Cámara de calidad media o superior
- Android 8+ o iOS 12+
- Conexión estable a internet

### ¿Recomendaciones para el día a día?
1. ✅ Carga el dispositivo la noche anterior
2. ✅ Llega 10 minutos temprano
3. ✅ Ten buena iluminación
4. ✅ Posición fija para el escáner
5. ✅ Organiza a los alumnos en fila
6. ✅ Ten códigos QR de repuesto
7. ✅ Exporta el reporte al final del día

### ¿Con qué frecuencia debo actualizar los estados de pago?
Recomendamos hacerlo semanalmente o cuando haya cambios.

## 🆘 Soporte

### ¿Dónde encuentro ayuda?
Revisa los archivos de documentación:
- `SETUP_GUIDE.md` - Guía de configuración inicial
- `DOCUMENTATION.md` - Documentación completa
- `TECHNICAL_ARCHITECTURE.md` - Detalles técnicos

### ¿Hay soporte técnico?
Contacta al administrador del sistema o al equipo de desarrollo.

### ¿Puedo sugerir mejoras?
¡Por supuesto! El sistema está en constante evolución. Comparte tus ideas.

---

## 📞 ¿Más preguntas?

Si tu pregunta no está aquí, contacta al equipo de soporte técnico.

**QR-School-Admin** - Aquí para ayudarte 🎓💙
