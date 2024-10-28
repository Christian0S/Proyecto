document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#cotizacionesTable tbody');

    // Función para renderizar la tabla
    function renderTable(data) {
        tableBody.innerHTML = ''; // Limpiar tabla antes de renderizar
        data.forEach(cotizacion => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cotizacion.id}</td>
                <td>${cotizacion.nombreCompra}</td>
                <td>${cotizacion.proveedor}</td>
                <td>${cotizacion.fechaCreada}</td>
                <td>${cotizacion.fechaEntrega}</td>
                <td>${cotizacion.valor}</td>
                <td>${cotizacion.creadaPor}</td>
                <td>
                    <button class="viewBtn" data-id="${cotizacion.id}">👁️ Ver</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Agregar eventos a los botones de Ver y Eliminar
        document.querySelectorAll('.viewBtn').forEach(button => {
            button.addEventListener('click', event => {
                const cotizacionId = event.target.getAttribute('data-id');
                window.location.href = `/html/gerente/procesos/cotizaciones/verCotizacion.html?id=${cotizacionId}`;
            });
        });

        document.querySelectorAll('.deleteBtn').forEach(button => {
            button.addEventListener('click', event => {
                const cotizacionId = event.target.closest('tr').querySelector('td').textContent;
                eliminarCotizacion(cotizacionId);
            });
        });
    }

    // Cargar datos desde el archivo JSON
    fetch('/jsons/cotizaciones.json')
        .then(response => response.json())
        .then(data => {
            renderTable(data);

            // Buscar cotización
            document.getElementById('searchBtn').addEventListener('click', () => {
                const searchValue = document.getElementById('search').value.toLowerCase();
                const filteredData = data.filter(cotizacion => cotizacion.nombreCompra.toLowerCase().includes(searchValue));
                renderTable(filteredData);
            });

            // Función para eliminar cotización
            function eliminarCotizacion(id) {
                const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar la cotización con ID ${id}?`);
                if (confirmDelete) {
                    // Aquí se eliminaría la cotización del array
                    console.log(`Cotización con ID ${id} eliminada.`);
                    // Actualizar el renderizado después de eliminar
                    const updatedData = data.filter(cotizacion => cotizacion.id != id);
                    renderTable(updatedData);
                }
            }
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
});
