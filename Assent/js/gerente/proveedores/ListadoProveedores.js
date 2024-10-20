let providers = [];

// Cargar datos de un archivo JSON al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    fetch('/JSONs/proveedores.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos cargados:', data); // Verifica si los datos se cargan
            providers = data; // Asigna los datos cargados al array de proveedores
            localStorage.setItem('providers', JSON.stringify(providers)); // Guarda en localStorage
            renderProviders(); // Renderiza los proveedores en la tabla
        })
        .catch(error => {
            console.error('Hubo un problema con la carga del JSON:', error);
            const storedProviders = localStorage.getItem('providers');
            if (storedProviders) {
                providers = JSON.parse(storedProviders);
                console.log('Datos cargados desde localStorage:', providers); // Verifica si los datos del localStorage se cargan
                renderProviders();
            } else {
                console.log('No se encontraron datos en localStorage.');
            }
        });
});

// Renderizar proveedores en la tabla
function renderProviders() {
    const providerBody = document.getElementById('providerBody');

    // Si el elemento no existe, salimos de la función para evitar errores
    if (!providerBody) {
        console.error('Elemento con id "providerBody" no encontrado.');
        return;
    }

    providerBody.innerHTML = ''; // Limpiar tabla

    if (providers.length === 0) {
        providerBody.innerHTML = '<tr><td colspan="6">No hay proveedores disponibles.</td></tr>';
        return;
    }

    providers.forEach(provider => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${provider.id}</td>
            <td>${provider.correo}</td>
            <td>${provider.nombre}</td>
            <td>${provider.cantidadCalificaciones}</td>
            <td>${provider.calificacion}</td>
            <td>
                <button onclick="editProvider(${provider.id})">✏️</button>
                <button onclick="deleteProvider(${provider.id})">❌</button>
                <button onclick="openChat(${provider.id})">💬</button>
            </td>
        `;
        providerBody.appendChild(row);
    });
}

// Abrir chat con proveedor en una ventana nueva
function openChat(id) {
    const provider = providers.find(p => p.id === id);
    if (provider) {
        const chatWindow = window.open('/Html/gerente/CHAT/chat.html', '_blank', 'width=400,height=600');
        chatWindow.onload = function() {
            // Pasar datos del proveedor al chat
            chatWindow.localStorage.setItem('selectedProvider', JSON.stringify(provider));
        };
    } else {
        console.error(`Proveedor con ID ${id} no encontrado.`);
    }
}

// Editar proveedor (redirigir a la página de edición)
function editProvider(id) {
    window.location.href = `/html/gerente/proveedores/editarProveedor.html?id=${id}`; // Redirigir a la página de edición
}

// Eliminar proveedor
function deleteProvider(id) {
    providers = providers.filter(provider => provider.id !== id);
    localStorage.setItem('providers', JSON.stringify(providers));
    renderProviders();
}

// Funcionalidad de búsqueda
document.getElementById('searchInput').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filteredProviders = providers.filter(provider => {
        return (
            provider.nombre.toLowerCase().includes(searchTerm) ||
            provider.calificacion.toString().includes(searchTerm) ||
            provider.id.toString().includes(searchTerm)
        );
    });
    renderFilteredProviders(filteredProviders);
});

// Renderizar proveedores filtrados
function renderFilteredProviders(filteredProviders) {
    const providerBody = document.getElementById('providerBody');
    providerBody.innerHTML = ''; // Limpiar tabla

    if (filteredProviders.length === 0) {
        providerBody.innerHTML = '<tr><td colspan="6">No hay proveedores disponibles.</td></tr>';
        return;
    }

    filteredProviders.forEach(provider => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${provider.id}</td>
            <td>${provider.correo}</td>
            <td>${provider.nombre}</td>
            <td>${provider.cantidadCalificaciones}</td>
            <td>${provider.calificacion}</td>
            <td>
                <button onclick="editProvider(${provider.id})">✏️</button>
                <button onclick="deleteProvider(${provider.id})">❌</button>
                <button onclick="openChat(${provider.id})">💬</button>
            </td>
        `;
        providerBody.appendChild(row);
    });
}