// Carrusel de imágenes (básico)
let currentIndex = 0;
const images = document.querySelectorAll('.carousel-images img');
setInterval(() => {
    images[currentIndex].style.display = 'none';
    currentIndex = (currentIndex + 1) % images.length;
    images[currentIndex].style.display = 'block';
}, 3000);
