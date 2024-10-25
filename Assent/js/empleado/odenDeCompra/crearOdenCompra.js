// Array de rutas para cada botón
const rutas = {
    compraProductos: "/html/empleado/OrdenDeCompra/crearOrden/compreDeProductos.html", // Página de compra de productos
    servicios: "servicios.html" // Página de servicios
};

// Obtener el contenedor de los botones
const botones = document.querySelectorAll(".option-item");

// Asociar un evento de clic a cada botón
botones.forEach((boton) => {
    boton.addEventListener("click", function() {
        const textoBoton = this.textContent.trim(); // Obtener el texto del botón
        let ruta;

        // Determinar la ruta según el texto del botón
        switch (textoBoton.toLowerCase()) {
            case 'plantas':
            case 'materas':
            case 'artesanías':
            case 'abonos-tierra': // Agregado para artesanías y materas
                ruta = rutas.compraProductos; // Redirige a la misma página de compra
                break;
            case 'servicios':
                ruta = rutas.servicios; // Redirige a la página de servicios
                break;
            default:
                console.error('Botón no reconocido:', textoBoton);
                return; // Salir si el botón no es reconocido
        }

        // Redirigir a la página con el parámetro de filtro
        window.location.href = `${ruta}?filtro=${encodeURIComponent(textoBoton)}`;
    });
});
