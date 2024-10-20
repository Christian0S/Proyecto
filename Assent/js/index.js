// Función para cifrar contraseñas usando SHA-256
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
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
        alert(`Bienvenido, ${user.name}!`);

        // Guardar los datos del usuario en localStorage
        localStorage.setItem('userData', JSON.stringify({
            nombre: user.name,
            rol: user.position // Asumiendo que 'position' contiene el rol
        }));

        // Redirigir según el rol del usuario
        if (user.position === "empleado") {
            window.location.href = "empleado.html";
        } else if (user.position === "proveedor") {
            window.location.href = "proveedor.html";
        } else if (user.position === "gerente") {
            window.location.href = "/html/gerente/Inicio.html";
        }
    } else {
        alert("Usuario o contraseña incorrectos o cuenta no aceptada.");
    }
}

// Asociar la función al botón de inicio de sesión
document.querySelector('form').addEventListener('submit', login);
