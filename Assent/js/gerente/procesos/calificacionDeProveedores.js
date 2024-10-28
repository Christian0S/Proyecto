document.addEventListener('DOMContentLoaded', () => {
    const ratingModal = document.getElementById('ratingModal');
    const selectProduct = document.getElementById('selectProduct');
    const productError = document.getElementById('productError');
    const nextBtn = document.getElementById('nextBtn');
    const saveBtn = document.getElementById('saveBtn');
    const prevBtn = document.getElementById('prevBtn'); // Botón Anterior
    const closeBtn = document.getElementById('closeBtn');

    // Verificar si los elementos existen
    if (!ratingModal || !selectProduct || !productError || !nextBtn || !saveBtn || !prevBtn || !closeBtn) {
        console.error('Uno o más elementos del DOM no se encontraron.');
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const cotizacionId = urlParams.get('id');
    let currentProductIndex = 0;
    let productos = []; // Variable para almacenar los productos

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

                // Almacenar productos para su uso posterior
                productos = cotizacion.productos;

                // Cargar la lista de productos en la tabla
                loadProductTable(productos);

                // Cargar el selector de productos
                selectProduct.innerHTML = productos.map((producto, index) =>
                    `<option value="${index}">${producto.nombre}</option>`
                ).join('');
            } else {
                console.error('No se encontró la cotización con el ID proporcionado.');
            }
        } catch (error) {
            console.error('Error al cargar los datos:', error);
        }
    };

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

    // Mostrar modal
    document.getElementById('calificarBtn').addEventListener('click', () => {
        ratingModal.style.display = 'block';
        currentProductIndex = 0; // Reinicia el índice al abrir el modal
        selectProduct.selectedIndex = currentProductIndex; // Selecciona el primer producto
        productError.textContent = ''; // Limpia errores al abrir
        loadProduct(currentProductIndex); // Cargar el primer producto
    });

    // Ocultar modal
    closeBtn.addEventListener('click', () => {
        ratingModal.style.display = 'none';
    });

    // Función para cargar el producto actual
    function loadProduct(index) {
        const product = productos[index];
        if (product) {
            selectProduct.value = index; // Selecciona el producto
            // Aquí puedes actualizar los campos del modal con la información del producto
            // Por ejemplo:
            document.getElementById('descripcion').value = ''; // Resetea la descripción
        }
    }

    // Ir al siguiente producto
    nextBtn.addEventListener('click', () => {
        if (currentProductIndex < productos.length - 1) {
            currentProductIndex++;
            loadProduct(currentProductIndex); // Cambiar el producto seleccionado
            productError.textContent = ''; // Limpia errores al cambiar
        } else {
            alert('No hay más productos para calificar.');
        }
    });

    // Ir al producto anterior
    prevBtn.addEventListener('click', () => {
        if (currentProductIndex > 0) {
            currentProductIndex--;
            loadProduct(currentProductIndex); // Cambiar el producto seleccionado
            productError.textContent = ''; // Limpia errores al cambiar
        } else {
            console.log('Este es el primer producto.');
        }
    });

    document.getElementById('volverBtn').addEventListener('click', () => {
        const currentUrl = window.location.href;
        // Verifica si la URL actual no es la de inicio de procesos
        if (!currentUrl.includes('inicoProcesos.html')) {
            window.location.href = '/html/gerente/procesos/inicoProcesos.html', '_blank';
        } else {
            alert("Ya estás en la página de procesos.");
        }
    });

    // Guardar calificación del producto
    saveBtn.addEventListener('click', () => {
        const selectedProduct = selectProduct.value;
        const calidad = document.querySelector('input[name="calidad"]:checked')?.value;
        const precio = document.querySelector('input[name="precio"]:checked')?.value;
        const entrega = document.querySelector('input[name="entrega"]:checked')?.value;
        const puntualidad = document.querySelector('input[name="puntualidad"]:checked')?.value;
        const descripcion = document.getElementById('descripcion').value;

        if (selectedProduct && calidad && precio && entrega && puntualidad) {
            console.log("Producto:", selectedProduct, "Calidad:", calidad, "Precio:", precio, "Entrega:", entrega, "Puntualidad:", puntualidad, "Descripción:", descripcion);
            alert("Calificación guardada con éxito.");
            // Aquí puedes agregar la lógica para guardar la calificación en tu sistema
            // Por ejemplo, enviar los datos a un servidor
            ratingModal.style.display = 'none'; // Cierra el modal al guardar
        } else {
            productError.textContent = "Complete todos los campos de calificación.";
        }
    });

    // Inicializa el primer producto en el modal
    loadProduct(currentProductIndex);
});
