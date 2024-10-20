let empleados = [];

// Cargar datos de un archivo JSON al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    fetch('/JSONs/empleado.json') // Cambia esta ruta al archivo JSON
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos cargados:', data); // Verifica si los datos se cargan
            empleados = data; // Asigna los datos cargados al array de empleados
            localStorage.setItem('empleados', JSON.stringify(empleados)); // Guarda en localStorage
            renderEmpleados(); // Renderiza los empleados en la tabla
        })
        .catch(error => {
            console.error('Hubo un problema con la carga del JSON:', error);
            const storedEmpleados = localStorage.getItem('empleados');
            if (storedEmpleados) {
                empleados = JSON.parse(storedEmpleados);
                console.log('Datos cargados desde localStorage:', empleados); // Verifica si los datos del localStorage se cargan
                renderEmpleados();
            } else {
                console.log('No se encontraron datos en localStorage.');
            }
        });
});

// Renderizar empleados en la tabla
function renderEmpleados() {
    const employeeBody = document.getElementById('employeeBody');

    // Si el elemento no existe, salimos de la función para evitar errores
    if (!employeeBody) {
        console.error('Elemento con id "employeeBody" no encontrado.');
        return;
    }

    employeeBody.innerHTML = ''; // Limpiar tabla

    if (empleados.length === 0) {
        employeeBody.innerHTML = '<tr><td colspan="8">No hay empleados disponibles.</td></tr>';
        return;
    }

    empleados.forEach(empleado => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${empleado.id}</td>
            <td>${empleado.numeroIdentificacion}</td>
            <td>${empleado.correo}</td>
            <td>${empleado.nombre} ${empleado.apellidos}</td>
            <td>${empleado.cargo}</td>
            <td>${empleado.rol}</td>
            <td>
                <a href="${empleado.documentos}" target="_blank">📄</a>
            </td>
            <td>
                <button onclick="editEmpleado(${empleado.id})">✏️</button>
                <button onclick="deleteEmpleado(${empleado.id})">❌</button>
            </td>
        `;
        employeeBody.appendChild(row);
    });
}

// Editar empleado (redirigir a la página de edición)
function editEmpleado(id) {
    window.location.href = `/html/gerente/empleados/EditarEmpleado.html?id=${id}`; // Redirigir a la página de edición
}

// Eliminar empleado
function deleteEmpleado(id) {
    empleados = empleados.filter(empleado => empleado.id !== id);
    localStorage.setItem('empleados', JSON.stringify(empleados));
    renderEmpleados(); // Actualiza la tabla después de eliminar
}

// Funcionalidad de búsqueda
document.getElementById('searchInput').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filteredEmpleados = empleados.filter(empleado => {
        return (
            empleado.nombre.toLowerCase().includes(searchTerm) ||
            empleado.apellidos.toLowerCase().includes(searchTerm) ||
            empleado.numeroIdentificacion.toString().includes(searchTerm) ||
            empleado.cargo.toLowerCase().includes(searchTerm)
        );
    });
    renderFilteredEmpleados(filteredEmpleados);
});

// Renderizar empleados filtrados
function renderFilteredEmpleados(filteredEmpleados) {
    const employeeBody = document.getElementById('employeeBody');
    employeeBody.innerHTML = ''; // Limpiar tabla

    if (filteredEmpleados.length === 0) {
        employeeBody.innerHTML = '<tr><td colspan="8">No hay empleados disponibles.</td></tr>';
        return;
    }

    filteredEmpleados.forEach(empleado => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${empleado.id}</td>
            <td>${empleado.numeroIdentificacion}</td>
            <td>${empleado.correo}</td>
            <td>${empleado.nombre} ${empleado.apellidos}</td>
            <td>${empleado.cargo}</td>
            <td>${empleado.rol}</td>
            <td>
                <a href="${empleado.documentos}" target="_blank">📄</a>
            </td>
            <td>
                <button onclick="editEmpleado(${empleado.id})">✏️</button>
                <button onclick="deleteEmpleado(${empleado.id})">❌</button>
            </td>
        `;
        employeeBody.appendChild(row);
    });
}
