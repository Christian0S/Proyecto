// Función para cifrar contraseñas usando SHA-256
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Función para redirigir según el rol del usuario
function redirectUser(role) {
    switch (role) {
        case "empleado":
            window.location.href = "html/empleado/inicio.html";
            break;
        case "proveedor":
            window.location.href = "html/proveedor/inicio.html";
            break;
        case "gerente":
            window.location.href = "html/gerente/inicio.html";
            break;
        default:
            alert("Rol de usuario desconocido.");
    }
}

// Función para manejar el inicio de sesión
async function login(event) {
    event.preventDefault();

    const username = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const hashedPassword = await sha256(password);

    // Verificar si hay usuarios almacenados en localStorage
    let users = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Si no hay usuarios, cargar usuarios predeterminados
    if (users.length === 0) {
        try {
            const response = await fetch('jsons/usuarios.json');
            if (!response.ok) throw new Error('Error al cargar usuarios predeterminados');
            users = await response.json();
            localStorage.setItem('usuarios', JSON.stringify(users)); // Guardar en localStorage
        } catch (error) {
            console.error("Error al cargar usuarios predeterminados:", error);
            alert("No se pudo cargar la lista de usuarios.");
            return;
        }
    }

    // Buscar al usuario en el JSON con la contraseña cifrada
    const user = users.find(user => user.email === username && user.password === hashedPassword && user.accepted);

    if (user) {
        // Guardar los datos del usuario en localStorage
        localStorage.setItem('userData', JSON.stringify({
            email: user.email, // Cambia 'nombre' a 'email'
            rol: user.position // Suponiendo que 'position' contiene el rol
        }));

        // Redirigir según el rol del usuario
        redirectUser(user.position);
    } else {
        alert("Usuario o contraseña incorrectos o cuenta no aceptada.");
    }
}

// Función para verificar sesión al cargar la página
function checkSession() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        redirectUser(userData.rol); // Redirigir según el rol del usuario
    }
}

// Asociar la función al botón de inicio de sesión
document.querySelector('form').addEventListener('submit', login);

// Verificar sesión al cargar la página
window.onload = checkSession;
