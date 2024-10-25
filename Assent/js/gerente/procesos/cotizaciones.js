document.addEventListener('DOMContentLoaded', () => {
    // Simulación de datos de cotizaciones
    const cotizaciones = [
        {
            id: 1,
            nombreCompra: 'Compra 1',
            proveedor: 'Proveedor 1',
            fechaCreada: '2024-10-01',
            fechaEntrega: '2024-10-10',
            valor: '$1000',
            creadaPor: 'Gerente A',
            productos: [
                { name: 'Producto 1', category: 'Categoría 1', size: 'Mediano', date: '2024-10-01', quantity: 10, description: 'Descripción del producto 1' }
            ]
        },
        {
            id: 2,
            nombreCompra: 'Compra 2',
            proveedor: 'Proveedor 2',
            fechaCreada: '2024-10-02',
            fechaEntrega: '2024-10-12',
            valor: '$1500',
            creadaPor: 'Gerente B',
            productos: [
                { name: 'Producto 2', category: 'Categoría 2', size: 'Grande', date: '2024-10-02', quantity: 15, description: 'Descripción del producto 2' }
            ]
        }
    ];

    const tableBody = document.querySelector('#cotizacionesTable tbody');

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

    // Renderizar las cotizaciones
    renderTable(cotizaciones);

    // Buscar cotización
    document.getElementById('searchBtn').addEventListener('click', () => {
        const searchValue = document.getElementById('search').value.toLowerCase();
        const filteredData = cotizaciones.filter(cotizacion => cotizacion.nombreCompra.toLowerCase().includes(searchValue));
        renderTable(filteredData);
    });

    // Función para eliminar cotización
    function eliminarCotizacion(id) {
        const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar la cotización con ID ${id}?`);
        if (confirmDelete) {
            // Aquí se eliminaría la cotización del array
            console.log(`Cotización con ID ${id} eliminada.`);
            // Actualizar el renderizado después de eliminar
            const updatedData = cotizaciones.filter(cotizacion => cotizacion.id != id);
            renderTable(updatedData);
        }
    }
});
