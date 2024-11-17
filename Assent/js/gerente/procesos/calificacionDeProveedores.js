document.addEventListener('DOMContentLoaded', () => {
    const ratingModal = document.getElementById('ratingModal');
    const selectProduct = document.getElementById('selectProduct');
    const productError = document.getElementById('productError');
    const nextBtn = document.getElementById('nextBtn');
    const saveBtn = document.getElementById('saveBtn');
    const prevBtn = document.getElementById('prevBtn');
    const closeBtn = document.getElementById('closeBtn');
    const volverBtn = document.getElementById('volverBtn');

    const urlParams = new URLSearchParams(window.location.search);
    const cotizacionId = urlParams.get('id');
    let currentProductIndex = 0;
    let productos = [];
    let evaluaciones = [];

    // Obtener datos de la cotización y cargar campos
    const fetchCotizacionData = async () => {
        try {
            const response = await fetch('/jsons/compras.json');
            const data = await response.json();
            const cotizacion = data.find(cot => cot.id == cotizacionId);
            if (cotizacion) {
                document.getElementById('nombreCompra').textContent = cotizacion.nombrePedido;
                document.getElementById('proveedor').textContent = cotizacion.proveedor;
                document.getElementById('fechaCreada').textContent = cotizacion.fechaCreacion;
                document.getElementById('valor').textContent = cotizacion.valorTotal;
                document.getElementById('estado').textContent = cotizacion.estado;

                productos = cotizacion.productos;
                loadProductTable(productos);
                selectProduct.innerHTML = productos.map((producto, index) =>
                    `<option value="${index}">${producto.nombre}</option>`
                ).join('');
                obtenerEvaluacionesPorCompra(cotizacionId);
            } else {
                console.error('No se encontró la cotización con el ID proporcionado.');
            }
        } catch (error) {
            console.error('Error al cargar los datos:', error);
        }
    };

    function obtenerEvaluacionesPorCompra(idCompra) {
        console.log('idCompra recibido:', idCompra);  // Verificar el id recibido
        fetch('/jsons/evaluaciones.json')
            .then(response => response.json())
            .then(data => {
                console.log('Datos cargados:', data);  // Verificar los datos del JSON cargado
                let evaluaciones = data.filter(evaluacion => evaluacion.idCompra === Number(idCompra));
                console.log('Evaluaciones encontradas:', evaluaciones);
                if (evaluaciones.length > 0) {
                    evaluaciones.forEach(evaluacion => {
                        const calificacion = evaluacion.producto.calificacion;
                        console.log('Calificación:', calificacion);
                        mostrarEvaluaciones(calificacion);
                    });
                } else {
                    console.log('No hay evaluaciones para esta compra.');
                }
            })
            .catch(error => {
                console.error('Error al cargar el archivo JSON:', error);
            });
    }
    

    // Función para mostrar las evaluaciones
    function mostrarEvaluaciones(evaluaciones) {
        // Verificar si evaluaciones es un objeto y no un array
        if (evaluaciones && typeof evaluaciones === 'object' && !Array.isArray(evaluaciones)) {
            const calidad = evaluaciones.calidad;
            const precio = evaluaciones.precio;
            const entrega = evaluaciones.entrega;
            const puntualidad = evaluaciones.puntualidad;
            const descripcion = evaluaciones.descripcion;
    
            // Función para marcar el radio correspondiente
            function marcarRadio(nombreCampo, valor) {
                const radios = document.getElementsByName(nombreCampo);
                radios.forEach(radio => {
                    if (radio.value == valor) {
                        radio.checked = true;
                    }
                });
            }
    
            // Marcar los radios para cada sección
            marcarRadio('calidad', calidad);
            marcarRadio('precio', precio);
            marcarRadio('entrega', entrega);
            marcarRadio('puntualidad', puntualidad);
    
            // Descripción
            const descripcionField = document.getElementById('descripcion');
            if (descripcionField) {
                descripcionField.value = descripcion;
            }
        } else {
            console.error('Las evaluaciones no son un objeto válido:', evaluaciones);
        }
    }
    

    function loadProduct(index) {
        const product = productos[index];
        if (product) {
            selectProduct.value = index; // Selecciona el producto
            document.getElementById('descripcion').value = ''; // Resetea la descripción
    
            // Verificar si el producto ya tiene una calificación guardada
            const evaluacion = evaluaciones.find(evaluacion => evaluacion.idCompra == cotizacionId && evaluacion.productoIndex == index);
            if (evaluacion) {
                document.querySelector(`input[name="calidad"][value="${evaluacion.calificacion.calidad}"]`).checked = true;
                document.querySelector(`input[name="precio"][value="${evaluacion.calificacion.precio}"]`).checked = true;
                document.querySelector(`input[name="entrega"][value="${evaluacion.calificacion.entrega}"]`).checked = true;
                document.querySelector(`input[name="puntualidad"][value="${evaluacion.calificacion.puntualidad}"]`).checked = true;
                document.getElementById('descripcion').value = evaluacion.calificacion.descripcion;
            }
        }
    }
    

    // Función para cargar la tabla de productos
    const loadProductTable = (productos) => {
        const productList = document.getElementById('productList');
        productList.innerHTML = ''; // Limpiar tabla antes de cargar nuevos datos

        productos.forEach(producto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>${producto.valorUnitario}</td>
            `;
            productList.appendChild(row);
        });
    };

    // Cargar los datos de la cotización al iniciar
    fetchCotizacionData();

    // Mostrar modal para calificar
    document.getElementById('calificarBtn').addEventListener('click', () => {
        ratingModal.style.display = 'block';
        currentProductIndex = 0;
        selectProduct.selectedIndex = currentProductIndex;
        productError.textContent = '';
        loadProduct(currentProductIndex);
    });

    // Cerrar modal
    closeBtn.addEventListener('click', () => {
        ratingModal.style.display = 'none';
    });

    // Función para cargar el producto actual en el modal
    function loadProduct(index) {
        const product = productos[index];
        if (product) {
            selectProduct.value = index;
            document.getElementById('descripcion').value = '';

            const evaluacion = evaluaciones.find(evaluacion => evaluacion.idCompra == cotizacionId && evaluacion.productoIndex == index);
            if (evaluacion) {
                document.querySelector(`input[name="calidad"][value="${evaluacion.calificacion.calidad}"]`).checked = true;
                document.querySelector(`input[name="precio"][value="${evaluacion.calificacion.precio}"]`).checked = true;
                document.querySelector(`input[name="entrega"][value="${evaluacion.calificacion.entrega}"]`).checked = true;
                document.querySelector(`input[name="puntualidad"][value="${evaluacion.calificacion.puntualidad}"]`).checked = true;
                document.getElementById('descripcion').value = evaluacion.calificacion.descripcion;
            }
        }
    }

    // Ir al siguiente producto
    nextBtn.addEventListener('click', () => {
        if (currentProductIndex < productos.length - 1) {
            currentProductIndex++;
            loadProduct(currentProductIndex);
            productError.textContent = '';
        } else {
            alert('No hay más productos para calificar.');
        }
    });

    // Ir al producto anterior
    prevBtn.addEventListener('click', () => {
        if (currentProductIndex > 0) {
            currentProductIndex--;
            loadProduct(currentProductIndex);
            productError.textContent = '';
        } else {
            console.log('Este es el primer producto.');
        }
    });

    // Volver a la página de inicio de procesos
    volverBtn.addEventListener('click', () => {
        const currentUrl = window.location.href;
        if (!currentUrl.includes('inicoProcesos.html')) {
            window.location.href = '/html/gerente/procesos/inicoProcesos.html', '_blank';
        } else {
            alert("Ya estás en la página de procesos.");
        }
    });

    // Guardar la calificación del producto
    saveBtn.addEventListener('click', () => {
        const selectedProductIndex = selectProduct.value;
        const productoSeleccionado = productos[selectedProductIndex];
        const calidad = document.querySelector('input[name="calidad"]:checked')?.value;
        const precio = document.querySelector('input[name="precio"]:checked')?.value;
        const entrega = document.querySelector('input[name="entrega"]:checked')?.value;
        const puntualidad = document.querySelector('input[name="puntualidad"]:checked')?.value;
        const descripcion = document.getElementById('descripcion').value;

        if (!calidad || !precio || !entrega || !puntualidad) {
            productError.textContent = 'Por favor, califique todos los aspectos.';
            return;
        }

        const nuevaEvaluacion = {
            idCompra: cotizacionId,
            productoIndex: selectedProductIndex,
            producto: {
                nombre: productoSeleccionado.nombre,
                calificacion: {
                    calidad,
                    precio,
                    entrega,
                    puntualidad
                },
                descripcion
            }
        };

        const existingEvaluacionIndex = evaluaciones.findIndex(evaluacion => evaluacion.productoIndex === selectedProductIndex);
        if (existingEvaluacionIndex !== -1) {
            evaluaciones[existingEvaluacionIndex] = nuevaEvaluacion;
        } else {
            evaluaciones.push(nuevaEvaluacion);
        }

        alert("Calificación guardada correctamente.");
        ratingModal.style.display = 'none';
        loadProduct(currentProductIndex);
    });
});
