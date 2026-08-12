
---

## ARCHIVO 6: docs/requerimientos.md

```markdown
# Requerimientos del sistema

> Listado completo de requerimientos funcionales y no funcionales de la intranet escolar.

## Requerimientos funcionales

### Autenticación y roles

- [x] Sistema de login con usuario y contraseña
- [x] Tres roles diferenciados: administración, docente, estudiante
- [x] Redirección a panel según rol
- [x] Cierre de sesión
- [ ] Recuperación de contraseña

### Gestión de usuarios (administración)

- [x] Listar todos los usuarios del sistema
- [x] Crear nuevo usuario con rol asignado
- [x] Editar datos de un usuario existente
- [x] Eliminar un usuario del sistema
- [ ] Buscar usuarios por nombre o rol

### Módulo académico

- [x] Docente registra calificación por materia y estudiante
- [x] Estudiante consulta sus propias calificaciones
- [x] Docente pasa lista de asistencia diaria
- [ ] Estudiante consulta su propio historial de asistencia
- [ ] Generar reporte de calificaciones por materia

### Tablón de comunicados

- [x] Administración crea comunicado
- [x] Docente crea comunicado
- [x] Todos los roles consultan comunicados
- [ ] Editar o eliminar comunicado existente
- [ ] Comunicados con fecha de caducidad

### Consulta por rol

- [x] Administración solo accede a panel de administración
- [x] Docente solo accede a panel de docente
- [x] Estudiante solo accede a panel de estudiante
- [x] No es posible acceder a un panel de otro rol mediante URL

---

## Requerimientos no funcionales

### Accesibilidad

- [x] Contraste de colores suficiente (WCAG AA)
- [x] Etiquetas `<label>` asociadas a cada `<input>`
- [x] Navegación posible con teclado (Tab, Enter)
- [ ] Textos alternativos en todas las imágenes
- [ ] Skip navigation link

### Seguridad de datos

- [x] Contraseñas no almacenadas en texto plano
- [x] Datos personales de menores no expuestos innecesariamente
- [x] Sesión destruida al cerrar el navegador (sessionStorage)
- [ ] Validación de entrada en formulario de registro
- [ ] Sanitización de contenido en comunicados

### Versionado

- [x] Repositorio en Git desde el primer commit
- [x] Historial de commits que muestra trabajo gradual
- [x] Uso de ramas para desarrollo
- [x] Mensajes de commit descriptivos

### Documentación

- [x] README.md con instalación y ejemplo de uso
- [x] CONTRIBUTING.md con flujo de trabajo
- [x] CHANGELOG.md con historial de versiones
- [x] CLAUDE.md con las 7 secciones de memoria del agente
- [x] docs/arquitectura.md con decisiones técnicas
- [x] docs/requerimientos.md (este archivo)

---

> "Lo que no se especifica, no se construye." — Principio de requerimientos