// Función para cifrar contraseñas usando SHA-256
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    console.log(hashHex)
    return hashHex;
}

// Función para verificar si la contraseña es válida
function validarContraseña(contraseña) {
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(contraseña);  // La contraseña debe tener al menos una letra mayúscula, un número y un mínimo de 8 caracteres
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

    // Leer usuarios existentes desde el archivo usuarios.json
    let usuarios = [];
    try {
        const response = await fetch('../../JSONs/usuarios.json');
        usuarios = await response.json();
    } catch (error) {
        console.error("Error al leer el archivo JSON de usuarios:", error);
    }

    // Agregar nuevo usuario a la lista
    usuarios.push(usuario);

    // Guardar los usuarios actualizados en el archivo usuarios.json (simulación)
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// Evento de envío del formulario
document.getElementById('registroForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nombre = document.getElementById('name').value;
    const cargo = document.getElementById('position').value;
    const correo = document.getElementById('email').value;
    const contraseña = document.getElementById('password').value;
    const confirmContraseña = document.getElementById('confirmPassword').value;

    // Validar la contraseña
    if (!validarContraseña(contraseña)) {
        alert("La contraseña debe tener al menos una letra mayúscula, un número y un mínimo de 8 caracteres.");
        return;
    }

    if (contraseña !== confirmContraseña) {
        alert("Las contraseñas no coinciden");
        return;
    }

    // Si todo es válido, guardar la solicitud pendiente
    await guardarSolicitudPendiente(nombre, cargo, correo, contraseña);
    alert("Su solicitud de registro ha sido enviada para aprobación.");
    window.location.href = "../Index.html";  // Redirigir al inicio de sesión
});
