let data = [];

async function fetchData() {
    try {
        const response = await fetch('/jsons/comprasPorValidar.json'); // Ajusta la ruta a tu archivo JSON
        data = await response.json();
        fillTable();
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

function fillTable() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.nombrePedido}</td>
            <td>${item.proveedor}</td>
            <td>${item.fechaCreacion}</td>
            <td>${item.valorTotal}</td>
            <td>${item.direccionEntrega}</td>
            <td>${item.fechaEntrega}</td>
            <td>${item.estado}</td>
            <td>
                <button class="view-quote" data-id="${item.id}" onclick="viewQuote(${item.id})">Ver Cotización</button>
                <button class="sla" onclick="viewSLAv(${item.id})">SLA</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function viewQuote(id) {
    window.open(`/html/gerente/procesos/cotizaciones/comprasPorValidar.html?id=${id}`);
}

function viewSLAv(id) {
    // Verificamos que los datos están cargados antes de buscar
    if (Array.isArray(data) && data.length > 0) {
        const compra = data.find(item => item.id === id);

        if (compra) {
            const docDefinition = {
                content: [
                    { text: 'Acuerdo de Nivel de Servicio (SLA)', style: 'header' },
                    { text: `Fecha de Inicio: ${compra.fechaCreacion}`, margin: [0, 10, 0, 10] },
                    { text: `Proveedor: ${compra.proveedor}`, margin: [0, 0, 0, 10] },
                    { text: `Fecha de Entrega: ${compra.fechaEntrega}`, margin: [0, 0, 0, 10] },
                    { text: `Valor Total: ${compra.valorTotal}`, margin: [0, 0, 0, 10] },
                    { text: '1. Introducción del SLA', style: 'subheader' },
                    {
                        text: [
                            'Este Acuerdo de Nivel de Servicio (SLA) establece los términos y condiciones bajo los cuales Pedro proporcionará productos y servicios a Vivero Las Magnolias. El objetivo de este SLA es garantizar la calidad y la puntualidad en la entrega de los siguientes productos.'
                        ]
                    },
                    { text: 'Productos', style: 'subheader' },
                    {
                        table: {
                            headerRows: 1,
                            widths: ['*', 'auto', 'auto', 'auto'],
                            body: [
                                ['Producto', 'Cantidad', 'Fecha de Entrega', 'Valor Total'],
                                ...compra.productos.map(producto => [producto.nombre, producto.cantidad, compra.fechaEntrega, producto.valorUnitario])
                            ]
                        },
                        margin: [0, 10, 0, 10]
                    },
                    { text: '2. Objetivos del SLA', style: 'subheader' },
                    {
                        ul: [
                            'Establecer expectativas claras entre el vivero y el proveedor.',
                            'Garantizar un suministro constante de productos de alta calidad.',
                            'Reducir el riesgo de interrupciones en la cadena de suministro.',
                            'Mejorar la comunicación y la cooperación entre ambas partes.'
                        ]
                    },
                    { text: '3. Niveles de Servicio', style: 'subheader' },
                    {
                        ul: [
                            'Disponibilidad del Producto: 80% de disponibilidad garantizada de los productos solicitados.',
                            'Tiempo de Entrega: Entrega de productos dentro de la fecha estipulada.',
                            'Calidad del Producto: Productos de buena calidad asegurado.'
                        ]
                    },
                    { text: '4. Proceso de Pedido y Entrega', style: 'subheader' },
                    {
                        ul: [
                            'Realización del Pedido: El vivero enviará los pedidos a través del software del Vivero Las Magnolias.',
                            'Confirmación del Pedido: El proveedor confirmará la recepción del pedido en un plazo de días en el portal del software.',
                            'Despacho y Entrega: El proveedor se encargará del embalaje y transporte de los productos, garantizando que lleguen en las condiciones acordadas.'
                        ]
                    },
                    { text: '5. Consecuencias del Incumplimiento', style: 'subheader' },
                    {
                        ul: [
                            'Descuentos del 20% en el próximo pedido por retrasos en la entrega.',
                            'Reemplazo gratuito de productos defectuosos dentro de 30 días.',
                            'Compensación adicional por incumplimientos repetidos.'
                        ]
                    }
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        alignment: 'center'
                    },
                    subheader: {
                        fontSize: 14,
                        bold: true,
                        marginTop: 10
                    }
                }
            };
            pdfMake.createPdf(docDefinition).open();
        } else {
            console.error('No se encontró el pedido con el id especificado.');
        }
    } else {
        console.error('Los datos no están disponibles para la validación.');
    }
}

function filterTable() {
    const searchValue = document.getElementById('search').value.toLowerCase();
    const rows = document.querySelectorAll('#table-body tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowText = Array.from(cells).map(cell => cell.textContent.toLowerCase()).join(' ');
        row.style.display = rowText.includes(searchValue) ? '' : 'none';
    });
}

fetchData();
