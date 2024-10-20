// Obtener datos del proveedor desde el localStorage o JSON
function loadProviderData() {
    // Obtener el ID del proveedor desde la URL
    const params = new URLSearchParams(window.location.search);
    const providerId = params.get('id');

    // Cargar los datos desde el JSON
    fetch('/JSONs/proveedores.json') // Cambia la ruta al archivo JSON real
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            return response.json();
        })
        .then(data => {
            // Buscar el proveedor en el JSON
            const provider = data.find(p => p.id === Number(providerId)); // Asegúrate de comparar con un número
            if (provider) {
                // Rellenar el formulario con los datos del proveedor
                document.getElementById('nombre').value = provider.nombre || '';
                document.getElementById('apellidos').value = provider.apellidos || ''; // Asegúrate de que exista este campo en el JSON
                document.getElementById('tipoIdentificacion').value = provider.tipoIdentificacion || '';
                document.getElementById('numeroIdentificacion').value = provider.numeroIdentificacion || '';
                document.getElementById('pais').value = provider.pais || '';
                document.getElementById('ciudad').value = provider.ciudad || '';
                document.getElementById('direccion').value = provider.direccion || '';
                document.getElementById('telefono').value = provider.telefono || '';
                document.getElementById('correo').value = provider.correo || '';
                document.getElementById('createdBy').innerText = provider.creadoPor || '';
                document.getElementById('userRoleBy').innerText = provider.rol || ''; // Cargar el rol del proveedor
                document.getElementById('creationDate').innerText = provider.fechaCreacion || '';

                // Cargar la imagen del proveedor
                document.getElementById('avatarsProveedor').src = provider.imagen || '/Assent/img/default-avatar.jpeg';
            } else {
                alert('Proveedor no encontrado.');
            }
        })
        .catch(error => console.error('Error al cargar los datos del proveedor:', error));
}

// Actualizar los datos del proveedor
function updateProvider(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const updatedProvider = {
        id: new URLSearchParams(window.location.search).get('id'), // Obtener el ID del proveedor
        nombre: document.getElementById('nombre').value,
        apellidos: document.getElementById('apellidos').value,
        tipoIdentificacion: document.getElementById('tipoIdentificacion').value,
        numeroIdentificacion: document.getElementById('numeroIdentificacion').value,
        pais: document.getElementById('pais').value,
        ciudad: document.getElementById('ciudad').value,
        direccion: document.getElementById('direccion').value,
        telefono: document.getElementById('telefono').value,
        correo: document.getElementById('correo').value,
        creadoPor: localStorage.getItem('usuario'), // Obtener el nombre del usuario actual
        fechaCreacion: new Date().toLocaleDateString(), // Actualizar la fecha de modificación
        imagen: document.getElementById('avatarsProveedor').src // Imagen actualizada
    };

    // Cargar los datos desde el JSON
    fetch('/path/to/your/providers.json') // Cambia la ruta al archivo JSON real
        .then(response => response.json())
        .then(data => {
            const providers = data.map(provider => 
                provider.id === Number(updatedProvider.id) ? updatedProvider : provider
            );

            // Guardar los datos actualizados en el JSON o localStorage
            localStorage.setItem('providers', JSON.stringify(providers));

            // Redirigir a la lista de proveedores o mostrar un mensaje de éxito
            alert('Proveedor actualizado con éxito.');
            window.location.href = '/Html/proveedor/proveedores.html'; // Redirigir a la lista de proveedores
        })
        .catch(error => console.error('Error al guardar los datos del proveedor:', error));
}

// Cargar los datos cuando se carga la página
window.onload = loadProviderData;
