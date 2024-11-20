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


// Función para mostrar/ocultar el menú lateral
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
}

// Función para mostrar/ocultar el menú de notificaciones
function toggleNotifications() {
    const notificationMenu = document.getElementById("notificationMenu");
    notificationMenu.style.display = notificationMenu.style.display === 'none' ? 'block' : 'none';
}

// Función para mostrar/ocultar el menú de perfil
function toggleProfile() {
    const profileMenu = document.getElementById("profileMenu");
    profileMenu.style.display = profileMenu.style.display === 'none' ? 'block' : 'none';
}

// Función para mostrar/ocultar el menú lateral en dispositivos pequeños
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active"); // Alterna la clase 'active' en el sidebar
}


// Manejo del cierre de sesión
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.clear();
    console.log("localStorage ha sido limpiado.");
    window.location.href = '/index.html'; 
});

// Función para mostrar notificaciones de inventario bajo
function mostrarNotificacionesInventario() {
    const notificationContainer = document.getElementById("notificaciones");
    const products = JSON.parse(localStorage.getItem("products")) || [];

    // Limpiar notificaciones previas
    notificationContainer.innerHTML = ""; 

    // Filtrar productos con inventario bajo
    const lowStockProducts = products.filter(product => product.quantityToAdd <= product.quantityToAlert);

    if (lowStockProducts.length === 0) {
        notificationContainer.innerHTML = '<p>No hay alertas de inventario bajo.</p>';
        return;
    }

    // Crear notificaciones
    lowStockProducts.forEach(product => {
        const notification = document.createElement("div");
        notification.classList.add("notificacion");

        // Crear un botón para cada notificación con el enlace a la página de inventario bajo
        const button = document.createElement("button");
        button.classList.add("notification-button");
        button.textContent = `Inventario bajo: ${product.name} (${product.quantityToAdd} unidades)`;
        button.onclick = function() {
            // Redirigir a la página de inventario bajo
            window.location.href = "/html/gerente/OrdenDeCompra/InvetarioBajo.html";
        };

        notification.appendChild(button);
        notificationContainer.appendChild(notification);
    });
}

// Función para mostrar y ocultar el menú de notificaciones
function toggleNotifications() {
    const notificationMenu = document.getElementById("notificationMenu");
    notificationMenu.style.display = (notificationMenu.style.display === 'none' || notificationMenu.style.display === '') ? 'block' : 'none';
}

// Llamar a la función para mostrar las notificaciones cuando se carga la página
document.addEventListener("DOMContentLoaded", mostrarNotificacionesInventario);
