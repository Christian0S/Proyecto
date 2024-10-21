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

// Función para mostrar la pantalla inicial
function mostrarPantallaInicial() {
    const pantallaInicial = document.createElement('div');
    pantallaInicial.id = 'pantalla-inicial';
    pantallaInicial.innerHTML = `
        <h2>Bienvenido al sistema</h2>
        <p>Esta es tu primera vez aquí. Por favor completa el registro.</p>
        <button id="cerrar-pantalla">Cerrar</button>
    `;
    document.body.appendChild(pantallaInicial);
    
    document.getElementById('cerrar-pantalla').addEventListener('click', function() {
        document.body.removeChild(pantallaInicial);
        localStorage.setItem('primerAcceso', 'false');  // Marca que ya no es el primer acceso
    });
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
        usuariosJson = await response.json();
    } catch (error) {
        console.error("Error al leer el archivo JSON de usuarios:", error);
    }

    // Verificar si el usuario ya existe en el JSON
    const usuarioExistenteJson = usuariosJson.find(user => user.email === correo);
    if (usuarioExistenteJson) {
        alert("Ya existe una solicitud de registro con este correo electrónico en el archivo JSON.");
        return;
    }

    // Agregar nuevo usuario a la lista
    usuarios.push(usuario);

    // Guardar los usuarios actualizados en localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
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
    mostrarPantallaInicial();
    localStorage.setItem('primerAcceso', 'true');  // Marca que es la primera vez
}
