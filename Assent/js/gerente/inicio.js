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



/////////////////////////////
let currentSlide = 0;
const slideInterval = 30000; // Cambia la imagen cada 3 segundos

function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-item');
    const totalSlides = slides.length;

    // Asegúrate de que el índice esté dentro de los límites
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }

    // Oculta todas las diapositivas y muestra la actual
    slides.forEach((slide, i) => {
        slide.style.display = (i === currentSlide) ? 'block' : 'none';
    });
}

// Función para mover a la siguiente o anterior diapositiva
function moveSlide(direction) {
    showSlide(currentSlide + direction);
}

// Cambia automáticamente a la siguiente diapositiva
function autoSlide() {
    moveSlide(1);
}

// Mostrar la primera diapositiva al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    showSlide(currentSlide);
    setInterval(autoSlide, slideInterval); // Cambia la diapositiva cada 3 segundos
});
