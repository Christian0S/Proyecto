let data = [];

function renderizarProductos(productos) {
    if (!productos || productos.length === 0) return 'Sin productos';
    return productos.map(producto => `
        <div>
            <strong>${producto.name || producto.nombre}</strong> - ${producto.quantity || producto.cantidad} unidades
        </div>
    `).join('');
}

function navigateTo(page) {
    fetch(page)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            document.getElementById('main-content').innerHTML = html;
            //Comentamos las llamadas para identificar cuál función podría causar problemas.
            if (page.includes('cotizaciones.html')) {
                 initCotizaciones();
            } else if (page.includes('estadoPedido.html')) {
                 initEstadoPedidos();
            } else if (page.includes('gestionFacturas.html')) {
                 initFacturas();
            } else {
                 iniDesempeno();
            }
        })
        .catch(error => console.error('Error al cargar la página:', error));
}


function initCotizaciones() {
    const tableBody = document.querySelector('#cotizacionesTable tbody');

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
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

// Tabla cotizaciones ===========================================================================

function renderTable(data) {
    const tableBody = document.querySelector('#cotizacionesTable tbody');
    tableBody.innerHTML = ''; // Limpiar tabla antes de renderizar

    data.forEach(cotizacion => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cotizacion.id}</td>
            <td>${cotizacion.nombreCompra}</td>
            <td>${cotizacion.fechaEntrega}</td>
            <td>${renderProductos(cotizacion.productos)}</td>
            <td>
                <button class="viewBtn" data-id="${cotizacion.id}">👁️ Hacer</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Agregar eventos a los botones de Ver
    document.querySelectorAll('.viewBtn').forEach(button => {
        button.addEventListener('click', event => {
            const cotizacionId = event.target.getAttribute('data-id');
            window.location.href = `/html/proveedor/opciones/cotizaciones/hacerCotizacion.html?id=${cotizacionId}`;
        });
    });
}

// Función para renderizar la lista de productos
function renderProductos(productos) {
    if (!productos || productos.length === 0) return 'Sin productos'; // Manejo si no hay productos
    return productos.map(producto => `
        <div>
            <strong>${producto.name}</strong> - ${producto.quantity} unidades
        </div>
    `).join(''); // Devuelve una cadena de HTML con los productos
}

// Estado Pedidos ==================================================================================

// Función para inicializar el estado de pedidos
function initEstadoPedidos() {
    const tableBody = document.querySelector('#estadoPedidosTable tbody');

    // Cargar datos desde el archivo JSON
    fetch('/jsons/compras.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData; // Asigna los datos a la variable global
            const filteredData = data.filter(factura => 
                (factura.estado.toLowerCase() === 'validar' || factura.estado.toLowerCase() === 'pendiente') &&
                factura.proveedor.toLowerCase() === 'guate' // Asegúrate de que se filtre por el proveedor "Guate"
            );
            renderEstadoPedidosTable(filteredData);

            // Buscar estado de pedidos
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

// Función para renderizar la tabla de estado de pedidos
function renderEstadoPedidosTable(data) {
    const tableBody = document.querySelector('#estadoPedidosTable tbody');
    tableBody.innerHTML = ''; // Limpiar tabla antes de renderizar

    data.forEach(item => {
        // Generar lista de productos específica para el item actual
        const productosList = item.productos.map(producto => `
            <li>${producto.nombre} - Cantidad: ${producto.cantidad}</li>
        `).join('');

        // Crear la fila de la tabla
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.nombrePedido}</td>
            <td>${item.valorTotal}</td>
            <td>${item.direccionEntrega}</td>
            <td>${item.fechaEntrega}</td>
            <td>
                <ul>${productosList}</ul>
            </td>
            <td>
                <button class="view-quote" data-id="${item.id}" onclick="viewQuote(${item.id})">Ver Cotización</button>
                <button class="sla" onclick="viewSLAva(${item.id})">SLA</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function viewQuote(id) {
    window.location.href = (`/html/proveedor/opciones/cotizaciones/cotizacionesAceptadas.html?id=${id}`);
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


// facturas ==========================================

function initFacturas() {
    const tableBody = document.querySelector('#facturasTable tbody');

    // Cargar datos desde el archivo JSON
    fetch('/jsons/compras.json') // Asegúrate de que esta ruta sea correcta
        .then(response => {
            console.log('Response status:', response.status); // Verifica el estado de la respuesta
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Facturas data:', data); // Verifica los datos cargados
            
            // Filtrar solo las facturas que estén en estado "completado" o "calificado"
            const filteredData = data.filter(factura => 
                (factura.estado.toLowerCase() === 'completado' || factura.estado.toLowerCase() === 'calificado') &&
                factura.proveedor.toLowerCase() === 'guate' // Asegúrate de que se filtre por el proveedor "Guate"
            );

            renderFacturasTable(filteredData); // Llama a la función para renderizar la tabla
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
}



// Función para renderizar la tabla de facturas
function renderFacturasTable(data) {
    const tableBody = document.querySelector('#facturasTable tbody');
    tableBody.innerHTML = ''; // Limpiar tabla antes de renderizar

    data.forEach(item => {
        const row = document.createElement('tr');

        // Generar lista de productos
        const productosList = item.productos.map(producto => `
            <li>${producto.nombre} - Cantidad: ${producto.cantidad}</li>
        `).join('');

        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.nombrePedido}</td>
            <td>${item.fechaEntrega}</td>
            <td>${item.valorTotal}</td>
            <td>${item.direccionEntrega}</td>
            <td>
                <ul>${productosList}</ul>
            </td>
            <td>
                <button class="view-quote" data-id="${item.id}" onclick="viewQuote(${item.id})">Cotización</button>
                <button class="viewFactura" data-id="${item.id}" onclick="viewFactura(${item.id})">Factura</button>
                <button class="sla" onclick="viewSLAva(${item.id})">SLA</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function viewFactura(id) {
    // Crear el contenedor del popup
    const popupContainer = document.createElement('div');
    popupContainer.classList.add('popup-container');
    
    popupContainer.innerHTML = `
        <div class="popup">
            <h3>Enviar Factura</h3>
            <p>El proveedor asociado al pedido te envía la factura correspondiente.</p>
            
            <label for="email">Correo destinatario:</label>
            <input type="email" id="email" placeholder="Ingresa el correo del destinatario" required>
            
            <label for="file">Subir factura (PDF):</label>
            <input type="file" id="file" accept=".pdf" required>
            
            <textarea id="message" placeholder="Mensaje...">Estimado cliente, el proveedor correspondiente le envía la factura. Gracias por su preferencia.</textarea>
            
            <button onclick="sendFactura(${id})">Enviar Factura</button>
            <button onclick="closePopup()">Cancelar</button>
        </div>
    `;

    // Añadir el popup al cuerpo del documento
    document.body.appendChild(popupContainer);
}


function sendFactura(id) {
    const email = document.getElementById('email').value;
    const fileInput = document.getElementById('file');
    const message = document.getElementById('message').value;
    
    if (!email || !fileInput.files.length) {
        alert("Por favor ingresa un correo y sube la factura.");
        return;
    }
    
    const facturaFile = fileInput.files[0];

    // Crear el formulario para enviar la información
    const formData = new FormData();
    formData.append('email', email);
    formData.append('file', facturaFile);
    formData.append('message', message);
    formData.append('id', id);

    // Aquí podrías usar fetch para enviar la información al servidor
    /*
    fetch('/ruta/para/enviar/factura', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        alert("Factura enviada con éxito");
        closePopup();
    })
    .catch(error => {
        alert("Error al enviar la factura");
        console.error(error);
    });
    */

    // Simulación del envío de la factura
    alert(`Factura enviada a ${email}`);
    closePopup();
}

// Función para cerrar el popup
function closePopup() {
    const popupContainer = document.querySelector('.popup-container');
    if (popupContainer) {
        popupContainer.remove();
    }
}

// Desempeño =========================================================================

function iniDesempeno() {
    const tableBody = document.querySelector('#desempenoTable tbody');

    // Cargar datos desde el archivo JSON
    fetch('/jsons/compras.json') // Asegúrate de que esta ruta sea correcta
        .then(response => {
            console.log('Response status:', response.status); // Verifica el estado de la respuesta
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('desempeno data:', data); // Verifica los datos cargados
            
            // Filtrar solo las facturas que estén en estado "completado" o "calificado" y que sean del proveedor "Guate"
            const filteredData = data.filter(desempeno => 
                desempeno.estado.toLowerCase() === 'calificado' &&
                desempeno.proveedor.toLowerCase() === 'guate' && 
                desempeno.desempeño !== undefined && // Asegúrate de que 'desempeño' no sea undefined
                desempeno.desempeño !== null && // También asegurarte de que no sea null
                desempeno.desempeño !== '' // Asegúrate de que no sea una cadena vacía
            );


            renderDesempenoTable(filteredData); // Llama a la función para renderizar la tabla
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

// Función para renderizar la tabla
function renderDesempenoTable(data) {
    const tableBody = document.querySelector('#desempenoTable tbody');
    tableBody.innerHTML = ''; // Limpiar tabla antes de renderizar

    data.forEach(item => {
        const row = document.createElement('tr');

        // Generar lista de productos
        const productosList = item.productos.map(producto => `
            <li>${producto.nombre} - Cantidad: ${producto.cantidad}</li>
        `).join('');

        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.nombrePedido}</td>
            <td>
                <ul>${productosList}</ul>
            </td>
            <td>${item.fechaEntrega}</td>
            <td>${item.direccionEntrega}</td>
            <td>${item.desempeño}</td>
            <td>
                <button class="view-Evaluación" data-id="${item.id}" onclick="viewEvaluación(${item.id})">Evaluación</button>
                <button class="view-quote" data-id="${item.id}" onclick="viewQuote(${item.id})">Cotización</button>
                <button class="sla" onclick="viewSLAva(${item.id})">SLA</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}
// ver evaaluacion  ========================================================================
function viewEvaluación(id) {
    window.location.href = (`/html/proveedor/opciones/cotizaciones/verCalificacion.html?id=${id}`);
}

// sla =============================================================================================

function viewSLAva(id) {
    // Verifica si los datos están cargados antes de buscar
    if (Array.isArray(data) && data.length > 0) {
        // Busca el pedido con el id especificado
        const compra = data.find(item => item.id === id);

        if (compra) {
            // Definición del documento PDF para el SLA
            const docDefinition = {
                content: [
                    { text: 'Acuerdo de Nivel de Servicio (SLA)', style: 'header' },
                    { text: `Fecha de Inicio: ${compra.fechaCreacion}`, margin: [0, 10, 0, 10] },
                    { text: `Proveedor: ${compra.proveedor}`, margin: [0, 0, 0, 10] },
                    { text: `Fecha de Entrega: ${compra.fechaEntrega}`, margin: [0, 0, 0, 10] },
                    { text: `Valor Total: ${compra.valorTotal}`, margin: [0, 0, 0, 10] },
                    
                    { text: '1. Introducción del SLA', style: 'subheader' },
                    { text: 'Este SLA establece los términos y condiciones para garantizar la calidad y puntualidad en la entrega de los productos.' },
                    
                    { text: 'Productos', style: 'subheader' },
                    {
                        table: {
                            headerRows: 1,
                            widths: ['*', 'auto', 'auto', 'auto'],
                            body: [
                                ['Producto', 'Cantidad', 'Fecha de Entrega', 'Valor Unitario'],
                                ...compra.productos.map(producto => [
                                    producto.nombre, 
                                    producto.cantidad, 
                                    compra.fechaEntrega, 
                                    producto.valorUnitario
                                ])
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
                            'Mejorar la comunicación y cooperación entre ambas partes.'
                        ]
                    },
                    
                    { text: '3. Niveles de Servicio', style: 'subheader' },
                    {
                        ul: [
                            'Disponibilidad del Producto: 80% de disponibilidad garantizada.',
                            'Tiempo de Entrega: Entrega de productos dentro de la fecha estipulada.',
                            'Calidad del Producto: Productos de buena calidad asegurada.'
                        ]
                    },
                    
                    { text: '4. Proceso de Pedido y Entrega', style: 'subheader' },
                    {
                        ul: [
                            'Realización del Pedido: El vivero envía pedidos a través del software del Vivero Las Magnolias.',
                            'Confirmación del Pedido: El proveedor confirma la recepción en un plazo de días en el portal del software.',
                            'Despacho y Entrega: El proveedor se encarga del embalaje y transporte de los productos.'
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
            
            // Genera y abre el PDF
            pdfMake.createPdf(docDefinition).open();
        } else {
            console.error('No se encontró el pedido con el id especificado.');
        }
    } else {
        console.error('Los datos no están disponibles para la validación.');
    }
}

function clearContent() {
    const contentArea = document.getElementById('content'); // Asegúrate de que este ID coincida
    contentArea.innerHTML = ''; // O puedes usar contentArea.style.display = 'none';
}


