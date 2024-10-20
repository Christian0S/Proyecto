// Función para previsualizar la imagen seleccionada
function previewImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const avatarImg = document.getElementById('avatarsProveedor');
        avatarImg.src = e.target.result; // Actualiza la imagen con la nueva imagen seleccionada
    }

    if (file) {
        reader.readAsDataURL(file); // Lee el archivo como URL de datos
    }
}

// Función para obtener datos del usuario desde localStorage o sessionStorage
function getUserData() {
    const userData = JSON.parse(localStorage.getItem('userData')); // O usa sessionStorage si es necesario

    if (userData) {
        return {
            nombre: userData.nombre || 'Usuario', // Nombre por defecto
            rol: userData.rol || 'Rol desconocido' // Rol por defecto
        };
    } else {
        return {
            nombre: 'Usuario', // Nombre por defecto si no hay datos
            rol: 'Rol desconocido' // Rol por defecto si no hay datos
        };
    }
}

// Función para cargar los datos de creación al cargar la página
function loadCreationInfo() {
    const userData = getUserData(); // Obtener datos del usuario

    // Mostrar el nombre y rol del usuario
    document.getElementById('createdBy').textContent = userData.nombre;
    document.getElementById('userRole').textContent = `Rol: ${userData.rol}`;
    document.getElementById('creationDate').textContent = new Date().toLocaleDateString(); // Mostrar la fecha actual
}

// Función para agregar un proveedor
function addProvider(event) {
    event.preventDefault(); // Prevenir el envío del formulario

    const nombre = document.getElementById('nombre').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const tipoIdentificacion = document.getElementById('tipoIdentificacion').value;
    const numeroIdentificacion = document.getElementById('numeroIdentificacion').value.trim();
    const pais = document.getElementById('pais').value;
    const ciudad = document.getElementById('ciudad').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const correo = document.getElementById('correo').value.trim();

    // Obtener la fecha actual
    const fechaCreacion = new Date().toLocaleDateString();

    // Obtener la imagen de la etiqueta <img>
    const imagen = document.getElementById('avatarsProveedor').src; // Obtener la URL de la imagen

    const newProvider = {
        id: Date.now(), // Generar un ID único basado en la fecha
        nombre: `${nombre} ${apellidos}`,
        tipoIdentificacion,
        numeroIdentificacion,
        pais,
        ciudad,
        direccion,
        telefono,
        correo,
        fechaCreacion,
        creadoPor: getUserData().nombre, // Obtener el creador
        rol: getUserData().rol, // Obtener el rol del creador
        calificacion: 0, // Calificación inicial
        cantidadCalificaciones: 0, // Cantidad de calificaciones inicial
        imagen // Agregar el campo de imagen al JSON
    };

    // Obtener los proveedores existentes del localStorage
    const providers = JSON.parse(localStorage.getItem('providers')) || [];

    // Verificar si el proveedor ya existe
    const exists = providers.some(provider => provider.numeroIdentificacion === numeroIdentificacion);
    if (exists) {
        alert('El proveedor ya existe.');
        return;
    }

    // Agregar el nuevo proveedor a la lista
    providers.push(newProvider);

    // Guardar la lista actualizada en el localStorage
    localStorage.setItem('providers', JSON.stringify(providers));

    // Redirigir a la página de proveedores
    window.location.href = '/html/gerente/proveedores/listadoProveedores.html';
}

// Llamar a la función para cargar los datos de creación al cargar la página
window.onload = loadCreationInfo;
