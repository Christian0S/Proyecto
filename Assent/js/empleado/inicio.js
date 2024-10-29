// Carrusel de imágenes (básico)
let currentIndex = 0;
const images = document.querySelectorAll('.carousel-images img');
setInterval(() => {
    images[currentIndex].style.display = 'none';
    currentIndex = (currentIndex + 1) % images.length;
    images[currentIndex].style.display = 'block';
}, 3000);


function toggleMessages() {
    const messageMenu = document.getElementById("messageMenu");
    const chatWindow = window.open('/html/empleado/chat/chat.html', '_blank', 'width=950,height=600');
    messageMenu.style.display = messageMenu.style.display === "none" ? "block" : "none";
}