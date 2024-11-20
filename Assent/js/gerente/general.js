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
    localStorage.clear();
    window.location.href = '/index.html'; 
});

// Función para mostrar notificaciones de solicitudes pendientes
function mostrarNotificacionesSolicitudes() {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const contenedorNotificaciones = document.getElementById('notificaciones');
    const notificacionesPendientes = usuarios.filter(user => !user.accepted);

    // No limpiar el contenido anterior, solo agregar las nuevas notificaciones
    notificacionesPendientes.forEach(user => {
        const notificacion = document.createElement('div');
        notificacion.classList.add('notificacion');

        const menuDesplegable = document.createElement('div');
        menuDesplegable.classList.add('menu-desplegable');
        menuDesplegable.style.display = 'none';

        menuDesplegable.innerHTML = `
            <p>Nombre: ${user.name}</p>
            <p>Correo: ${user.email}</p>
            <button onclick="aceptarRegistro('${user.email}')">Aceptar</button>
            <button onclick="rechazarRegistro('${user.email}')">Rechazar</button>
        `;

        notificacion.textContent = `Nueva solicitud de ${user.name}`;
        notificacion.appendChild(menuDesplegable);
        contenedorNotificaciones.appendChild(notificacion);

        // Mostrar/ocultar el menú desplegable
        notificacion.addEventListener('click', function(event) {
            event.stopPropagation();
            menuDesplegable.style.display = (menuDesplegable.style.display === 'block') ? 'none' : 'block';
        });
    });
}

// Función para mostrar notificaciones de inventario bajo
function mostrarNotificacionesInventario() {
    const notificationContainer = document.getElementById("notificaciones");
    const products = JSON.parse(localStorage.getItem("products")) || [];

    // No limpiar el contenido anterior, solo agregar nuevas notificaciones
    const lowStockProducts = products.filter(product => product.quantityToAdd <= product.quantityToAlert);

    lowStockProducts.forEach(product => {
        const notification = document.createElement("div");
        notification.classList.add("notificacion");

        const button = document.createElement("button");
        button.classList.add("notification-button");
        button.textContent = `Inventario bajo: ${product.name} (${product.quantityToAdd} unidades)`;
        button.onclick = function() {
            window.location.href = "/html/gerente/OrdenDeCompra/InvetarioBajo.html";
        };

        notification.appendChild(button);
        notificationContainer.appendChild(notification);
    });
}

// Función para alternar el menú de notificaciones
function toggleNotifications() {
    const notificationMenu = document.getElementById("notificationMenu");

    if (notificationMenu.style.display === 'none' || notificationMenu.style.display === '') {
        notificationMenu.style.display = 'block'; // Mostrar el menú
        mostrarNotificacionesSolicitudes(); // Mostrar las notificaciones de solicitudes
        mostrarNotificacionesInventario(); // Mostrar las notificaciones de inventario bajo
    } else {
        notificationMenu.style.display = 'none'; // Ocultar el menú
    }
}

// Cargar las notificaciones al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    mostrarNotificacionesSolicitudes(); // Muestra las notificaciones de solicitudes al cargar la página
    mostrarNotificacionesInventario(); // Muestra las notificaciones de inventario bajo
});
