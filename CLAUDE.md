git init
git add .
git commit -m "init: crear estructura de carpetas del proyecto"
1. Contexto
Intranet escolar para un colegio público de nivel medio. Aplicación web frontend con HTML, CSS y JavaScript puro. Los datos se persisten en localStorage del navegador. No hay backend ni base de datos externa. Usuarios: administración, docentes y estudiantes/familias.

2. Requerimientos
Login diferenciado por 3 roles
CRUD de usuarios (solo administración)
Registro de calificaciones por materia (docente)
Consulta de calificaciones propias (estudiante)
Control de asistencia diaria (docente)
Tablón de comunicados (crear: admin/docente, ver: todos)
Cada rol ve solo su panel correspondiente
3. Reglas
JavaScript vanilla, sin frameworks
Variables y funciones en camelCase
Nombres de archivos en minúsculas con guiones
Todo cambio en funcionalidad incluye actualización del CHANGELOG
Comentar el "por qué", no el "qué"
4. Restricciones
NO exponer datos personales de menores en la interfaz (usar iniciales o apodos si es necesario)
NO guardar contraseñas en texto plano (usar codificación base64 como mínimo)
NO usar var, solo const y let
NO mezclar lógica de presentación con lógica de datos
NO hacer commits directos a main
5. Objetivos
 Login por roles funcionando
 Panel de administración con CRUD de usuarios
 Módulo de calificaciones operativo
 Módulo de reservas de aulas
 Exportar calificaciones a PDF
6. Memoria del proyecto
2026-03-20: Se eligió stack vanilla (HTML/CSS/JS) en vez de React porque el curso es de introducción y el foco es la documentación en Markdown.
2026-03-22: Se decidió usar localStorage en vez de base de datos para simplificar el despliegue. Se documenta que en producción habría que migrar a un backend real.
2026-03-25: Se definieron 3 usuarios de prueba precargados para facilitar la demostración.
2026-04-01: Se eligió codificación base64 para contraseñas. No es segura para producción pero demuestra el concepto de no guardar texto plano.
7. Buenas prácticas
Un archivo HTML por vista principal, o secciones que se muestran/ocultan
CSS organizado por componente (header, cards, formularios)
JS separado en módulos por funcionalidad
Documentar decisiones técnicas en docs/arquitectura.md
Mantener el CLAUDE.md actualizado con cada decisión importa