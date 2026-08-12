/* ============================================================
   INTRANET ESCOLAR — Lógica principal
   ============================================================ */

// ===== DATOS INICIALES =====
const USUARIOS_POR_DEFECTO = [
    {
        id: 1,
        nombre: "Administrador del Sistema",
        usuario: "admin",
        password: btoa("admin123"),
        rol: "admin"
    },
    {
        id: 2,
        nombre: "María García",
        usuario: "mgarcia",
        password: btoa("docente123"),
        rol: "docente"
    },
    {
        id: 3,
        nombre: "Juan Pérez",
        usuario: "jperez",
        password: btoa("estudiante123"),
        rol: "estudiante"
    }
];

// ===== INICIALIZACIÓN =====
function inicializarDatos() {
    if (!localStorage.getItem("usuarios")) {
        localStorage.setItem("usuarios", JSON.stringify(USUARIOS_POR_DEFECTO));
    }
    if (!localStorage.getItem("calificaciones")) {
        localStorage.setItem("calificaciones", JSON.stringify([]));
    }
    if (!localStorage.getItem("asistencia")) {
        localStorage.setItem("asistencia", JSON.stringify([]));
    }
    if (!localStorage.getItem("comunicados")) {
        const ejemplo = [
            {
                id: 1,
                titulo: "Bienvenida al ciclo lectivo 2026",
                contenido: "Se da la bienvenida a todos los estudiantes y familias al nuevo ciclo lectivo. Las clases comienzan el lunes 10 de marzo.",
                fecha: "2026-03-05",
                autorId: 1
            }
        ];
        localStorage.setItem("comunicados", JSON.stringify(ejemplo));
    }
}

// ===== UTILIDADES =====
function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function guardarUsuarios(usuarios) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function obtenerCalificaciones() {
    return JSON.parse(localStorage.getItem("calificaciones")) || [];
}

function guardarCalificaciones(calificaciones) {
    localStorage.setItem("calificaciones", JSON.stringify(calificaciones));
}

function obtenerAsistencia() {
    return JSON.parse(localStorage.getItem("asistencia")) || [];
}

function guardarAsistencia(asistencia) {
    localStorage.setItem("asistencia", JSON.stringify(asistencia));
}

function obtenerComunicados() {
    return JSON.parse(localStorage.getItem("comunicados")) || [];
}

function guardarComunicados(comunicados) {
    localStorage.setItem("comunicados", JSON.stringify(comunicados));
}

function getSesion() {
    const sesion = sessionStorage.getItem("usuarioActual");
    return sesion ? JSON.parse(sesion) : null;
}

function generarId(arr) {
    if (arr.length === 0) return 1;
    return Math.max(...arr.map(item => item.id)) + 1;
}

function fechaHoy() {
    return new Date().toISOString().split("T")[0];
}

function claseNota(nota) {
    if (nota >= 7) return "nota-alta";
    if (nota >= 4) return "nota-media";
    return "nota-baja";
}

function claseRol(rol) {
    return "rol-" + rol;
}

// ===== AUTENTICACIÓN =====
function login(usuario, password) {
    const usuarios = obtenerUsuarios();
    const passwordCodificada = btoa(password);
    const encontrado = usuarios.find(
        u => u.usuario === usuario && u.password === passwordCodificada
    );
    if (encontrado) {
        sessionStorage.setItem("usuarioActual", JSON.stringify(encontrado));
        return encontrado;
    }
    return null;
}

function cerrarSesion() {
    sessionStorage.removeItem("usuarioActual");
    mostrarLogin();
}

function mostrarLogin() {
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("panel-activo"));
    document.getElementById("login").classList.add("seccion-activa");
    document.getElementById("form-login").reset();
    document.getElementById("login-error").style.display = "none";
}

function mostrarPanel(usuario) {
    document.getElementById("login").classList.remove("seccion-activa");
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("panel-activo"));

    if (usuario.rol === "admin") {
        document.getElementById("panel-admin").classList.add("panel-activo");
        document.getElementById("nombre-admin").textContent = usuario.nombre;
        renderTablaUsuarios();
        renderComunicados("lista-comunicados-admin");
    } else if (usuario.rol === "docente") {
        document.getElementById("panel-docente").classList.add("panel-activo");
        document.getElementById("nombre-docente").textContent = usuario.nombre;
        cargarEstudiantesEnSelect();
        renderTablaCalificacionesDocente(usuario);
        renderTablaAsistencia();
        renderComunicados("lista-comunicados-docente");
    } else if (usuario.rol === "estudiante") {
        document.getElementById("panel-estudiante").classList.add("panel-activo");
        document.getElementById("nombre-estudiante").textContent = usuario.nombre;
        renderNotasEstudiante(usuario);
        renderComunicados("lista-comunicados-estudiante");
    }
}

// ===== TABS =====
function initTabs() {
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const panel = this.closest(".panel");
            const tabId = this.getAttribute("data-tab");

            panel.querySelectorAll(".tab-btn").forEach(t => t.classList.remove("activo"));
            panel.querySelectorAll(".tab-content").forEach(c => c.classList.remove("activo"));

            this.classList.add("activo");
            document.getElementById(tabId).classList.add("activo");
        });
    });
}

// ===== GESTIÓN DE USUARIOS (ADMIN) =====
function renderTablaUsuarios() {
    const usuarios = obtenerUsuarios();
    const tbody = document.querySelector("#tabla-usuarios tbody");
    tbody.innerHTML = "";

    usuarios.forEach(u => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${u.id}</td>
            <td>${u.nombre}</td>
            <td>${u.usuario}</td>
            <td><span class="rol-badge ${claseRol(u.rol)}">${u.rol}</span></td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="editarUsuario(${u.id})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${u.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function mostrarFormUsuario(editando = false) {
    const container = document.getElementById("form-usuario-container");
    container.style.display = "block";
    document.getElementById("form-usuario-titulo").textContent = editando ? "Editar usuario" : "Nuevo usuario";
    if (!editando) {
        document.getElementById("form-usuario").reset();
        document.getElementById("usuario-id").value = "";
    }
}

function ocultarFormUsuario() {
    document.getElementById("form-usuario-container").style.display = "none";
    document.getElementById("form-usuario").reset();
    document.getElementById("usuario-id").value = "";
}

function editarUsuario(id) {
    const usuarios = obtenerUsuarios();
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return;

    document.getElementById("usuario-id").value = usuario.id;
    document.getElementById("usuario-nombre").value = usuario.nombre;
    document.getElementById("usuario-user").value = usuario.usuario;
    document.getElementById("usuario-rol").value = usuario.rol;
    document.getElementById("usuario-pass").value = "";

    mostrarFormUsuario(true);
}

function eliminarUsuario(id) {
    const sesion = getSesion();
    if (sesion && sesion.id === id) {
        alert("No podés eliminar tu propio usuario.");
        return;
    }

    if (!confirm("¿Eliminás este usuario?")) return;

    let usuarios = obtenerUsuarios();
    usuarios = usuarios.filter(u => u.id !== id);
    guardarUsuarios(usuarios);
    renderTablaUsuarios();
}

// ===== CALIFICACIONES (DOCENTE) =====
function cargarEstudiantesEnSelect() {
    const usuarios = obtenerUsuarios();
    const estudiantes = usuarios.filter(u => u.rol === "estudiante");
    const select = document.getElementById("calif-estudiante");
    select.innerHTML = "";

    estudiantes.forEach(e => {
        const option = document.createElement("option");
        option.value = e.id;
        option.textContent = e.nombre;
        select.appendChild(option);
    });
}

function renderTablaCalificacionesDocente(docente) {
    const calificaciones = obtenerCalificaciones();
    const usuarios = obtenerUsuarios();
    const delDocente = calificaciones.filter(c => c.docenteId === docente.id);
    const tbody = document.querySelector("#tabla-calificaciones-docente tbody");
    tbody.innerHTML = "";

    delDocente.forEach(c => {
        const estudiante = usuarios.find(u => u.id === c.estudianteId);
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${estudiante ? estudiante.nombre : "Desconocido"}</td>
            <td>${c.materia}</td>
            <td class="${claseNota(c.nota)}">${c.nota}</td>
            <td>${c.fecha}</td>
        `;
        tbody.appendChild(tr);
    });
}

function mostrarFormCalificacion() {
    document.getElementById("form-calificacion-container").style.display = "block";
    document.getElementById("form-calificacion").reset();
    document.getElementById("calif-fecha").value = fechaHoy();
}

function ocultarFormCalificacion() {
    document.getElementById("form-calificacion-container").style.display = "none";
}

// ===== NOTAS (ESTUDIANTE) =====
function renderNotasEstudiante(estudiante) {
    const calificaciones = obtenerCalificaciones();
    const mias = calificaciones.filter(c => c.estudianteId === estudiante.id);
    const tbody = document.querySelector("#tabla-notas-estudiante tbody");
    const sinNotas = document.getElementById("sin-notas");
    tbody.innerHTML = "";

    if (mias.length === 0) {
        sinNotas.style.display = "block";
        return;
    }

    sinNotas.style.display = "none";

    mias.forEach(c => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.materia}</td>
            <td class="${claseNota(c.nota)}">${c.nota}</td>
            <td>${c.fecha}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ===== ASISTENCIA (DOCENTE) =====
function renderTablaAsistencia() {
    const usuarios = obtenerUsuarios();
    const estudiantes = usuarios.filter(u => u.rol === "estudiante");
    const tbody = document.querySelector("#tabla-asistencia tbody");
    tbody.innerHTML = "";

    document.getElementById("asistencia-fecha").value = fechaHoy();

    estudiantes.forEach(e => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${e.nombre}</td>
            <td>
                <select class="asistencia-select" data-estudiante-id="${e.id}">
                    <option value="presente">Presente</option>
                    <option value="ausente">Ausente</option>
                    <option value="justificado">Justificado</option>
                    <option value="tardanza">Tardanza</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function guardarAsistencia() {
    const fecha = document.getElementById("asistencia-fecha").value;
    if (!fecha) {
        alert("Seleccioná una fecha.");
        return;
    }

    const sesion = getSesion();
    const selects = document.querySelectorAll("#tabla-asistencia .asistencia-select");
    let asistencia = obtenerAsistencia();

    asistencia = asistencia.filter(a => !(a.fecha === fecha && a.docenteId === sesion.id));

    selects.forEach(sel => {
        const registro = {
            id: generarId(asistencia),
            estudianteId: parseInt(sel.getAttribute("data-estudiante-id")),
            fecha: fecha,
            estado: sel.value,
            docenteId: sesion.id
        };
        asistencia.push(registro);
    });

    guardarAsistencia(asistencia);
    alert("Asistencia guardada correctamente.");
}

// ===== COMUNICADOS =====
function renderComunicados(containerId) {
    const comunicados = obtenerComunicados();
    const usuarios = obtenerUsuarios();
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    const ordenados = [...comunicados].sort((a, b) => b.fecha.localeCompare(a.fecha));

    if (ordenados.length === 0) {
        container.innerHTML = '<p class="empty-msg">No hay comunicados publicados.</p>';
        return;
    }

    ordenados.forEach(c => {
        const autor = usuarios.find(u => u.id === c.autorId);
        const div = document.createElement("div");
        div.className = "comunicado-card";
        div.innerHTML = `
            <h4>${c.titulo}</h4>
            <div class="fecha">${c.fecha} · ${autor ? autor.nombre : "Autor desconocido"}</div>
            <p>${c.contenido}</p>
        `;
        container.appendChild(div);
    });
}

function mostrarFormComunicado() {
    const adminPanel = document.getElementById("form-comunicado-container");
    const docPanel = document.getElementById("form-comunicado-container-doc");

    if (adminPanel && adminPanel.closest(".panel-activo")) {
        adminPanel.style.display = "block";
    }
    if (docPanel && docPanel.closest(".panel-activo")) {
        docPanel.style.display = "block";
    }
}

function ocultarFormComunicado() {
    const adminPanel = document.getElementById("form-comunicado-container");
    if (adminPanel) adminPanel.style.display = "none";
    document.getElementById("form-comunicado").reset();
}

function ocultarFormComunicadoDoc() {
    const docPanel = document.getElementById("form-comunicado-container-doc");
    if (docPanel) docPanel.style.display = "none";
    document.getElementById("form-comunicado-doc").reset();
}

function crearComunicado(titulo, contenido) {
    const sesion = getSesion();
    if (!sesion) return;

    const comunicados = obtenerComunicados();
    const nuevo = {
        id: generarId(comunicados),
        titulo: titulo,
        contenido: contenido,
        fecha: fechaHoy(),
        autorId: sesion.id
    };
    comunicados.push(nuevo);
    guardarComunicados(comunicados);

    if (sesion.rol === "admin") {
        renderComunicados("lista-comunicados-admin");
    } else if (sesion.rol === "docente") {
        renderComunicados("lista-comunicados-docente");
    }
}

// ===== EVENT LISTENERS =====
document.addEventListener("DOMContentLoaded", function () {
    inicializarDatos();
    initTabs();

    const sesion = getSesion();
    if (sesion) {
        mostrarPanel(sesion);
    } else {
        mostrarLogin();
    }

    // Form login
    document.getElementById("form-login").addEventListener("submit", function (e) {
        e.preventDefault();
        const usuario = document.getElementById("input-usuario").value.trim();
        const password = document.getElementById("input-password").value;

        const resultado = login(usuario, password);
        if (resultado) {
            document.getElementById("login-error").style.display = "none";
            mostrarPanel(resultado);
        } else {
            document.getElementById("login-error").style.display = "block";
        }
    });

    // Form usuario (CRUD)
    document.getElementById("form-usuario").addEventListener("submit", function (e) {
        e.preventDefault();
        const id = document.getElementById("usuario-id").value;
        const nombre = document.getElementById("usuario-nombre").value.trim();
        const usuario = document.getElementById("usuario-user").value.trim();
        const rol = document.getElementById("usuario-rol").value;
        const pass = document.getElementById("usuario-pass").value;

        let usuarios = obtenerUsuarios();

        if (id) {
            const index = users.findIndex(u => u.id === parseInt(id));
            if (index !== -1) {
                usuarios[index].nombre = nombre;
                usuarios[index].usuario = usuario;
                usuarios[index].rol = rol;
                if (pass) {
                    usuarios[index].password = btoa(pass);
                }
            }
        } else {
            if (!pass) {
                alert("La contraseña es obligatoria para un nuevo usuario.");
                return;
            }
            if (usuarios.find(u => u.usuario === usuario)) {
                alert("Ese nombre de usuario ya existe.");
                return;
            }
            const nuevo = {
                id: generarId(usuarios),
                nombre: nombre,
                usuario: usuario,
                password: btoa(pass),
                rol: rol
            };
            usuarios.push(nuevo);
        }

        guardarUsuarios(usuarios);
        ocultarFormUsuario();
        renderTablaUsuarios();
    });

    // Form calificación
    document.getElementById("form-calificacion").addEventListener("submit", function (e) {
        e.preventDefault();
        const sesion = getSesion();
        if (!sesion) return;

        const calificaciones = obtenerCalificaciones();
        const nueva = {
            id: generarId(calificaciones),
            estudianteId: parseInt(document.getElementById("calif-estudiante").value),
            materia: document.getElementById("calif-materia").value,
            nota: parseInt(document.getElementById("calif-nota").value),
            fecha: document.getElementById("calif-fecha").value,
            docenteId: sesion.id
        };
        calificaciones.push(nueva);
        guardarCalificaciones(calificaciones);
        ocultarFormCalificacion();
        renderTablaCalificacionesDocente(sesion);
    });

    // Form comunicado (admin)
    document.getElementById("form-comunicado").addEventListener("submit", function (e) {
        e.preventDefault();
        const titulo = document.getElementById("comunicado-titulo").value.trim();
        const contenido = document.getElementById("comunicado-contenido").value.trim();
        crearComunicado(titulo, contenido);
        ocultarFormComunicado();
    });

    // Form comunicado (docente)
    document.getElementById("form-comunicado-doc").addEventListener("submit", function (e) {
        e.preventDefault();
        const titulo = document.getElementById("comunicado-titulo-doc").value.trim();
        const contenido = document.getElementById("comunicado-contenido-doc").value.trim();
        crearComunicado(titulo, contenido);
        ocultarFormComunicadoDoc();
    });
});