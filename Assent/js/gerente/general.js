document.getElementById('editProfileBtn').addEventListener('click', function() {
    window.location.href = 'editar_perfil.html'; // Redirigir a la página de edición de perfil
});

document.getElementById('historyBtn').addEventListener('click', function() {
    window.location.href = 'historial.html'; // Redirigir a la página de historial
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.clear();
    console.log("localStorage ha sido limpiado.");
    // Lógica para cerrar sesión
    localStorage.removeItem('currentUser'); // Eliminar el usuario actual del localStorage
    window.location.href = '/Index.html'; // Redirigir al inicio
});


document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.avatar) {
        // Actualiza la imagen en el header
        const avatarImage = document.getElementById('avatar');
        if (avatarImage) {
            avatarImage.src = user.avatar;
        }
    }

    // Función para mostrar notificaciones
    function showNotification(message) {
        const notificationMenu = document.getElementById('notificationMenu');
        const notificationItem = document.createElement('a');
        notificationItem.className = 'button';
        notificationItem.textContent = message;
        notificationMenu.appendChild(notificationItem);
    }

    // Llamada a la función de notificación
    showNotification('Una nueva cuenta ha sido creada y está pendiente de aceptación.');

    // Si necesitas más notificaciones, puedes llamarlas aquí
});


function toggleOrdenMenu() {
    var ordenMenu = document.getElementById("ordenDropdown");
    if (ordenMenu.style.display === "block") {
        ordenMenu.style.display = "none"; // Hide if visible
    } else {
        ordenMenu.style.display = "block"; // Show if hidden
    }
}

// Función para mostrar notificación de alerta baja
function checkLowStock(product) {
    if (product.quantityToAdd <= product.quantityToAlert) {
        const notificationMessage = `Alerta: El producto ${product.name} está por debajo del nivel mínimo de stock.`;
        showNotification(notificationMessage);
    }
}

// Ejemplo de cómo llamar a la función con un producto
const savedProduct = JSON.parse(localStorage.getItem('savedProduct'));
if (savedProduct) {
    checkLowStock(savedProduct);
}

// Asegúrate de que la función `showNotification` ya esté definida en general.js para mostrar notificaciones
