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