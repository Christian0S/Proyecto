// Variables globales para almacenar productos, proveedores y productos de filtro
let productsData = JSON.parse(localStorage.getItem('OrdenCompraProducts')) || [];
let suppliersData = JSON.parse(localStorage.getItem('suppliers')) || [];
let productsFilterData = []; // Lista para almacenar los datos de productos desde el JSON
let selectedSuppliers = new Set(); // Almacena los proveedores seleccionados

// Cargar productos y proveedores al cargar la página
window.onload = async () => {
    await loadProducts(); // Cargar productos existentes de localStorage
    await loadProductsFromJSON(); // Cargar productos desde el JSON
    await loadSuppliersFromJSON(); // Cargar proveedores desde el JSON
    await loadSuppliers(); // Cargar proveedores en la tabla
};

// Cargar productos en la tabla
async function loadProducts() {
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = ''; // Limpiar la tabla antes de cargar

    productsData.forEach(product => {
        const productRow = document.createElement('tr');
        productRow.innerHTML = `
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.size || 'N/A'}</td>
            <td>${product.date ? new Date(product.date).toLocaleDateString() : 'N/A'}</td>
            <td><span class="selected-suppliers">0</span></td>
        `;
        productsList.appendChild(productRow);
    });
}

// Cargar productos desde el JSON para filtrar proveedores
async function loadProductsFromJSON() {
    try {
        const response = await fetch('/jsons/productos.json'); // Cambia esta ruta al archivo JSON correcto
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        productsFilterData = await response.json(); // Cargar los datos en la lista de productos de filtro
        console.log('Productos filtrados cargados:', productsFilterData);
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
}

// Cargar proveedores desde el JSON
async function loadSuppliersFromJSON() {
    try {
        const response = await fetch('/jsons/proveedores.json'); // Cambia esta ruta al archivo JSON correcto
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        suppliersData = await response.json(); // Cargar los datos de proveedores
        console.log('Proveedores cargados:', suppliersData);
    } catch (error) {
        console.error('Error fetching supplier data:', error);
    }
}

// Cargar proveedores en la tabla
async function loadSuppliers() {
    const suppliersList = document.getElementById('suppliersList');
    suppliersList.innerHTML = ''; // Limpiar la tabla antes de cargar

    // Filtrar proveedores según los productos cargados y su categoría
    const associatedSuppliers = suppliersData.filter(supplier => {
        // Filtrar productos por nombre
        return productsData.some(product => 
            supplier.productos.includes(product.name) // Coincide con los productos del proveedor
        );
    });

    // Si no se encuentra ningún proveedor con la coincidencia de nombre, se filtrará solo por categoría
    if (associatedSuppliers.length === 0) {
        const suppliersByCategory = suppliersData.filter(supplier => 
            productsData.some(product => product.category === supplier.productos) // Coincide con la categoría del proveedor
        );

        suppliersByCategory.forEach(supplier => {
            const purchaseId = Math.floor(Math.random() * 1000000000); // Generar ID de compra automáticamente
            const supplierRow = document.createElement('tr');
            supplierRow.innerHTML = `
                <td>${supplier.nombre}</td>
                <td>${supplier.calificacion}</td>
                <td>
                    <ul>
                        ${supplier.productos.map(product => `<li>${product}</li>`).join('')} <!-- Muestra los productos del proveedor -->
                    </ul>
                </td>
                <td>${purchaseId}</td>
                <td>
                    <button class="accept-button" onclick="selectSupplier('${supplier.nombre}', '${purchaseId}', this)">✔️</button>
                    <button class="reject-button" onclick="rejectSupplier('${supplier.nombre}')">❌</button>
                </td>
            `;
            suppliersList.appendChild(supplierRow);
        });
    } else {
        associatedSuppliers.forEach(supplier => {
            const purchaseId = Math.floor(Math.random() * 1000000000); // Generar ID de compra automáticamente
            const supplierRow = document.createElement('tr');
            supplierRow.innerHTML = `
                <td>${supplier.nombre}</td>
                <td>${supplier.calificacion}</td>
                <td>
                    <ul>
                        ${supplier.productos.filter(product => productsData.some(pd => pd.name === product)).map(product => `<li>${product}</li>`).join('')} <!-- Muestra solo los productos específicos -->
                    </ul>
                </td>
                <td>${purchaseId}</td>
                <td>
                    <button class="accept-button" onclick="selectSupplier('${supplier.nombre}', '${purchaseId}', this)">✔️</button>
                    <button class="reject-button" onclick="rejectSupplier('${supplier.nombre}')">❌</button>
                </td>
            `;
            suppliersList.appendChild(supplierRow);
        });
    }
}

// Función para seleccionar proveedor
function selectSupplier(supplierName, purchaseId, button) {
    // Evitar seleccionar más de un proveedor por producto
    if (selectedSuppliers.has(supplierName)) {
        alert(`El proveedor ${supplierName} ya ha sido seleccionado.`);
        return;
    }

    const productsList = document.getElementById('productsList');
    const selectedSuppliersCount = productsList.querySelectorAll('.selected-suppliers');

    // Aumentar el contador de proveedores seleccionados
    selectedSuppliersCount.forEach(count => {
        count.innerText = parseInt(count.innerText) + 1;
    });

    // Agregar el proveedor a la lista de seleccionados
    selectedSuppliers.add(supplierName);

    // Deshabilitar el botón de aceptación para evitar múltiples selecciones
    button.disabled = true;

    console.log(`Proveedor seleccionado: ${supplierName}, ID de compra: ${purchaseId}`);
}

// Función para rechazar proveedor
function rejectSupplier(supplierName) {
     // Eliminar el proveedor de la lista de seleccionados
     selectedSuppliers.delete(supplierName);

     const productsList = document.getElementById('productsList');
     const selectedSuppliersCount = productsList.querySelectorAll('.selected-suppliers');
 
     // Disminuir el contador de proveedores seleccionados
     selectedSuppliersCount.forEach(count => {
         count.innerText = Math.max(0, parseInt(count.innerText) - 1); // Evitar que el contador sea negativo
     });
 
     // Habilitar el botón de aceptación nuevamente
     button.parentElement.querySelector('.accept-button').disabled = false;
 
     console.log(`Proveedor rechazado: ${supplierName}`);
}

document.getElementById('sendButton').addEventListener('click', () => {
    const requestDetails = {
        suppliers: [],
        date: new Date().toLocaleString(), // Fecha actual
        deliveryTime: '', // Este campo se calculará más adelante
    };

    // Calcular la fecha de entrega (1 semana a partir de hoy)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7); // Sumar 7 días
    requestDetails.deliveryTime = deliveryDate.toLocaleDateString(); // Convertir a formato legible

    // Recorre los proveedores seleccionados y construye el mensaje
    selectedSuppliers.forEach(supplierName => {
        const supplierProducts = productsData.filter(product => {
            // Verifica si el producto está asociado con el proveedor actual
            return product.suppliers && product.suppliers.includes(supplierName); // Asegúrate de que cada producto tenga la propiedad 'suppliers'
        });

        if (supplierProducts.length > 0) {
            requestDetails.suppliers.push({
                supplierName: supplierName,
                products: supplierProducts.map(product => ({
                    name: product.name,
                    quantity: product.quantity,
                    size: product.size || 'N/A',
                    date: product.date ? new Date(product.date).toLocaleDateString() : 'N/A'
                }))
            });
        }
    });

    console.log('Productos enviados:', requestDetails);

    // Aquí puedes implementar la lógica para enviar el mensaje
    alert('Los productos han sido enviados a los proveedores seleccionados.');
});



