// Función para cifrar contraseñas usando SHA-256
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    console.log(hashHex); // Para depuración
    return hashHex;
}

// Función para verificar si la contraseña es válida
function validarContraseña(contraseña) {
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(contraseña); // La contraseña debe tener al menos una letra mayúscula, un número y un mínimo de 8 caracteres
}

// Función para guardar la solicitud de registro pendiente
async function guardarSolicitudPendiente(nombre, cargo, correo, contraseña) {
    const hashedPassword = await sha256(contraseña);
    const usuario = {
        name: nombre,
        position: cargo,
        email: correo,
        password: hashedPassword,
        accepted: false  // La cuenta estará pendiente de aceptación
    };

    // Leer usuarios existentes desde localStorage
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Verificar si el usuario ya existe en localStorage
    const usuarioExistenteLocalStorage = usuarios.find(user => user.email === correo);
    if (usuarioExistenteLocalStorage) {
        alert("Ya existe una solicitud de registro con este correo electrónico en localStorage.");
        return;
    }

    // Leer usuarios existentes desde el archivo JSON simulado (también en localStorage)
    let usuariosJson = [];
    try {
        const response = await fetch('../../jsons/usuarios.json');
        if (response.ok) {
            usuariosJson = await response.json();
        } else {
            console.error("No se pudo leer el archivo JSON de usuarios.");
        }
    } catch (error) {
        console.error("Error al leer el archivo JSON de usuarios:", error);
    }

    // Si el archivo JSON tiene usuarios, los fusionamos con los de localStorage
    usuarios = usuarios.concat(usuariosJson);

    // Verificar si el usuario ya existe en el archivo JSON o en localStorage
    const usuarioExistenteJson = usuarios.find(user => user.email === correo);
    if (usuarioExistenteJson) {
        alert("Ya existe una solicitud de registro con este correo electrónico en el archivo JSON o localStorage.");
        return;
    }

    // Agregar nuevo usuario a la lista
    usuarios.push(usuario);

    // Guardar los usuarios actualizados en localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    console.log("Usuarios después de agregar el nuevo usuario:", JSON.parse(localStorage.getItem('usuarios')));

    // Notificación al gerente
    enviarNotificacionAlGerente(usuario);
}

// Función para enviar una notificación al gerente
function enviarNotificacionAlGerente(usuario) {
    // Aquí va el código para enviar la notificación al gerente
    // Podría ser un correo electrónico, una notificación dentro de la aplicación, etc.
    console.log("Notificación enviada al gerente para aprobar al usuario:", usuario.email);

    // Este es un ejemplo simple de una notificación visual en el navegador
    alert(`Notificación al gerente: Nueva solicitud de registro de ${usuario.name} (${usuario.email}).`);
}

// Evento de envío del formulario
document.getElementById('registroForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nombre = document.getElementById('name').value.trim();
    const cargo = document.getElementById('position').value.trim();
    const correo = document.getElementById('email').value.trim();
    const contraseña = document.getElementById('password').value;
    const confirmContraseña = document.getElementById('confirmPassword').value;

    // Validar la contraseña
    if (!validarContraseña(contraseña)) {
        alert("La contraseña debe tener al menos una letra mayúscula, un número y un mínimo de 8 caracteres.");
        return;
    }

    if (contraseña !== confirmContraseña) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    // Si todo es válido, guardar la solicitud pendiente
    await guardarSolicitudPendiente(nombre, cargo, correo, contraseña);
    alert("Su solicitud de registro ha sido enviada para aprobación.");
    window.location.href = "../index.html";  // Redirigir al inicio de sesión
});

// Verificar si es la primera vez que el usuario accede
if (localStorage.getItem('primerAcceso') !== 'false') {
    localStorage.setItem('primerAcceso', 'true');  // Marca que es la primera vez
}

// Función para que el gerente acepte la solicitud
async function aceptarSolicitud(email) {
    // Leer usuarios existentes desde localStorage
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Buscar al usuario por su correo electrónico
    const usuario = usuarios.find(user => user.email === email);

    if (usuario) {
        usuario.accepted = true;  // Marcar la solicitud como aceptada

        // Guardar los usuarios actualizados en localStorage
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        console.log("Solicitud aceptada para el usuario:", email);
        alert(`El usuario ${usuario.name} ha sido aceptado.`);
    } else {
        alert("No se encontró al usuario.");
    }
}

// Llamada a la función de aceptación del gerente
// Para probar, podrías llamar a esta función con el correo del usuario que deseas aceptar.
