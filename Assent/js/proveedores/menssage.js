// Función para mostrar y ocultar mensajes
function toggleMessages() {
    const messageMenu = document.getElementById("messageMenu");
    const chatWindow = window.open('/html/proveedor/chat/chat.html', '_blank', 'width=950,height=600');
    messageMenu.style.display = messageMenu.style.display === "none" ? "block" : "none";
}