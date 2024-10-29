document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.avatar) {
        // Actualiza la imagen en el header
        const avatarImage = document.getElementById('avatar');
        if (avatarImage) {
            avatarImage.src = user.avatar;
        }
    }
});


function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}


// Redirigir a la página de edición de perfil
document.getElementById('editProfileBtn').addEventListener('click', function() {
    window.location.href = 'editar_perfil.html'; 
});

// Redirigir a la página de historial
document.getElementById('historyBtn').addEventListener('click', function() {
    window.location.href = 'historial.html'; 
});

// Manejo del cierre de sesión
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.clear()
    console.log("localStorage ha sido limpiado.");
    window.location.href = '/index.html'; 
});

// Función para mostrar notificaciones de solicitudes pendientes
function mostrarNotificaciones() {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const contenedorNotificaciones = document.getElementById('notificaciones');
    contenedorNotificaciones.innerHTML = ''; // Limpiar contenido anterior

    // Filtrar usuarios pendientes
    const solicitudesPendientes = usuarios.filter(user => !user.accepted);

    if (solicitudesPendientes.length === 0) {
        contenedorNotificaciones.innerHTML = '<p>No hay solicitudes pendientes.</p>'; // Mensaje si no hay notificaciones
        return;
    }

    solicitudesPendientes.forEach(user => {
        // Crear notificación
        const notificacion = document.createElement('div');
        notificacion.classList.add('notificacion');

        // Crear menú desplegable
        const menuDesplegable = document.createElement('div');
        menuDesplegable.classList.add('menu-desplegable');
        menuDesplegable.style.display = 'none'; // Inicialmente oculto

        // Información del usuario
        menuDesplegable.innerHTML = `
            <p>Nombre: ${user.name}</p>
            <p>Correo: ${user.email}</p>
            <button onclick="aceptarRegistro('${user.email}')">Aceptar</button>
            <button onclick="rechazarRegistro('${user.email}')">Rechazar</button>
        `;

        // Agregar la notificación y el menú a la interfaz
        notificacion.textContent = `Nueva solicitud de ${user.name}`;
        notificacion.appendChild(menuDesplegable);
        contenedorNotificaciones.appendChild(notificacion);

        // Evento de clic para mostrar/ocultar el menú
        notificacion.addEventListener('click', function(event) {
            event.stopPropagation(); // Evitar que el clic se propague al contenedor principal
            menuDesplegable.style.display = (menuDesplegable.style.display === 'block') ? 'none' : 'block';
        });
    });
}

// Función para aceptar una solicitud de registro
function aceptarRegistro(email) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios = usuarios.map(usuario => {
        if (usuario.email === email) {
            usuario.accepted = true; // Cambia el estado a aceptado
        }
        return usuario;
    });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    mostrarNotificaciones(); // Actualiza la lista de notificaciones
    alert(`Registro aceptado para ${email}.`);
}

// Función para rechazar una solicitud de registro
function rechazarRegistro(email) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios = usuarios.filter(usuario => usuario.email !== email); // Elimina al usuario de la lista
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    mostrarNotificaciones(); // Actualiza la lista de notificaciones
}

// Función para alternar el menú de notificaciones
function toggleNotifications() {
    const notificationMenu = document.getElementById('notificationMenu');

    // Verifica si el menú está visible o no y cambia su estado
    if (notificationMenu.style.display === 'none' || notificationMenu.style.display === '') {
        notificationMenu.style.display = 'block'; // Mostrar el menú
        mostrarNotificaciones(); // Llama a la función para cargar las notificaciones
    } else {
        notificationMenu.style.display = 'none'; // Ocultar el menú
    }
}

// Cargar las notificaciones al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    mostrarNotificaciones(); // Muestra las notificaciones al cargar la página
});
