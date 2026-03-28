# 🚀 Guía de Configuración Inicial - QR-School-Admin

## Paso 1: Crear el Primer Usuario Administrador

1. Abre la aplicación en tu navegador
2. En la pantalla de login, haz clic en **"¿No tienes cuenta? Regístrate"**
3. Completa el formulario:
   - **Nombre Completo**: Tu nombre (ej: "Juan Pérez")
   - **Correo Electrónico**: admin@tuescuela.com
   - **Contraseña**: Mínimo 6 caracteres
   - **Rol**: Selecciona **"Administrador"**
4. Haz clic en **"Crear Cuenta"**
5. Ahora inicia sesión con las credenciales que acabas de crear

## Paso 2: Agregar Alumnos al Sistema

1. Una vez dentro del Panel de Administración, verás un botón **"Nuevo Alumno"**
2. Haz clic y completa:
   - **Nombre Completo**: Nombre del alumno
   - **Grado**: Selecciona el grado (1° a 11°)
   - **Sección**: Ingresa la letra de la sección (A, B, C, etc.)
3. Haz clic en **"Crear"**
4. Por defecto, todos los alumnos se crean como **"Solvente"**

## Paso 3: Generar Códigos QR

Para cada alumno en la lista:

1. Haz clic en el icono de QR (📱) en la tarjeta del alumno
2. Se abrirá un modal con el código QR generado
3. Haz clic en **"Descargar QR"** para guardar la imagen
4. Imprime el código QR y entrégalo al alumno

### 💡 Recomendaciones para los códigos QR:
- Imprímelos en tamaño suficiente (mínimo 5cm x 5cm)
- Plastifícalos o colócalos en portacredenciales
- Asegúrate de que estén limpios y sin arrugas
- Cada código es único e irrepetible

## Paso 4: Gestionar Estados de Pago

En el Panel de Administración:

1. Cada alumno tiene un botón de estado que muestra:
   - **"✓ Solvente"** (Verde): El alumno está al día con sus pagos
   - **"✗ En Mora"** (Rojo): El alumno tiene pagos pendientes

2. Para cambiar el estado, simplemente haz clic en el botón
3. El cambio es instantáneo y afecta el escaneo de asistencia

⚠️ **Importante**: Solo los alumnos **Solventes** podrán registrar asistencia

## Paso 5: Crear Usuarios Adicionales (Profesores)

1. Desde tu cuenta de administrador, puedes crear cuentas para profesores
2. Ve a la pantalla de login (cierra sesión primero)
3. Regístrate con:
   - **Rol**: "Profesor/Monitor"
   - Los demás datos del profesor

Los profesores tendrán acceso a:
- ✅ Escáner QR
- ✅ Dashboard de asistencia
- ❌ NO Panel de administración

## Paso 6: Usar el Escáner QR

### Configuración Inicial:
1. Inicia sesión como profesor o admin
2. Ve a la sección **"Escáner"**
3. Haz clic en **"Activar Cámara"**
4. **MUY IMPORTANTE**: Cuando el navegador solicite permiso para usar la cámara, haz clic en **"Permitir"**

### Durante el Escaneo:
1. Mantén la cámara estable
2. Centra el código QR dentro del recuadro
3. Espera a que el sistema lo detecte automáticamente
4. Verás uno de estos mensajes:

   **✅ ÉXITO (Verde)**:
   - "Asistencia registrada para [Nombre]"
   - El registro se guarda con fecha y hora exacta

   **❌ EN MORA (Rojo)**:
   - "[Nombre] está en MORA. No se registró asistencia"
   - El alumno debe ponerse al día con sus pagos

   **⚠️ NO ENCONTRADO (Amarillo)**:
   - "Alumno no encontrado en el sistema"
   - Verifica que el código QR sea válido

## Paso 7: Consultar el Dashboard

1. Ve a la sección **"Dashboard"**
2. Por defecto muestra el día actual
3. Usa el selector de fecha para ver días anteriores
4. Visualiza:
   - Estadísticas generales (total, presentes, ausentes, %)
   - Gráfico circular de distribución
   - Gráfico de barras por grado
   - Lista completa con hora de entrada

## Paso 8: Exportar Reportes

1. En el Dashboard, haz clic en **"Exportar CSV"**
2. Se descargará un archivo con formato:
   ```
   Nombre, Grado, Sección, Hora de Entrada
   Juan Pérez, 5°, A, 07:30:15
   María López, 5°, A, 07:32:08
   ...
   ```
3. Abre el archivo en Excel, Google Sheets o cualquier programa de hojas de cálculo

## 🔧 Solución de Problemas Comunes

### La cámara no se activa:
- Verifica que diste permiso al navegador
- Recarga la página e intenta de nuevo
- Asegúrate de usar HTTPS o localhost
- Prueba con otro navegador (Chrome recomendado)

### El código QR no se escanea:
- Verifica que el código esté limpio y sin arrugas
- Mejora la iluminación del ambiente
- Acerca o aleja el código QR de la cámara
- Asegúrate de que el código esté bien enfocado

### No puedo crear alumnos:
- Verifica que iniciaste sesión como **Administrador**
- Los profesores NO pueden crear alumnos

### Los datos no se guardan:
- Verifica tu conexión a internet
- Revisa la consola del navegador (F12) para errores
- Contacta al soporte técnico

## 📱 Recomendaciones de Uso

### Para el escaneo diario:
1. **Llegada temprano**: Configura el escáner 10 minutos antes
2. **Buena iluminación**: Asegúrate de tener suficiente luz
3. **Posición fija**: Mantén el dispositivo en una posición estable
4. **Fila organizada**: Que los alumnos se formen ordenadamente
5. **Velocidad**: Cada escaneo toma menos de 2 segundos

### Para la gestión administrativa:
1. **Actualización de pagos**: Revisa y actualiza estados semanalmente
2. **Respaldo de datos**: Exporta el CSV mensualmente
3. **Códigos QR de repuesto**: Ten algunos impresos de emergencia
4. **Capacitación**: Asegúrate de que todo el personal sepa usar el sistema

## 🎯 Flujo de Trabajo Diario Recomendado

**Matutino (07:00 AM)**:
1. Enciende el dispositivo de escaneo
2. Abre la aplicación e inicia sesión
3. Activa la cámara
4. Comienza a registrar asistencia

**Durante el día**:
5. Consulta el dashboard para ver estadísticas en tiempo real
6. Identifica ausencias

**Al final del día (03:00 PM)**:
7. Exporta el reporte del día
8. Envía el CSV a la administración
9. Cierra sesión

## ✅ Lista de Verificación de Configuración

- [ ] Usuario administrador creado
- [ ] Al menos 5 alumnos de prueba agregados
- [ ] Códigos QR generados y descargados
- [ ] Códigos QR impresos y plastificados
- [ ] Cámara probada y funcionando
- [ ] Al menos un escaneo de prueba exitoso
- [ ] Dashboard verificado
- [ ] Exportación de CSV probada
- [ ] Usuarios profesores creados (si aplica)
- [ ] Personal capacitado en el uso del sistema

---

## 🆘 Contacto y Soporte

Si necesitas ayuda adicional, no dudes en contactar al equipo de soporte técnico.

**¡Sistema configurado y listo para usar! 🎉**
