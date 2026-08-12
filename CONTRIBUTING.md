Guía de contribución
Cómo colaborar en el desarrollo de la intranet escolar.

Ramas del proyecto
Rama	Uso
main	Código estable, listo para entregar
develop	Desarrollo activo
feat/nombre-feature	Nuevas funcionalidades
fix/nombre-bug	Correcciones
Flujo de trabajo
Crear una rama desde develop:
git checkout developgit pull origin developgit checkout -b feat/calificaciones
Hacer commits atómicos con mensajes claros
Subir la rama y abrir un Pull Request hacia develop
Esperar revisión de al menos un compañero
Mergear cuando esté aprobado
Convención de commits
Usamos el formato conventional commits:

feat: nueva funcionalidad
fix: corrección de error
docs: cambios en documentación
style: cambios de formato (sin lógica)
refactor: refactorización de código