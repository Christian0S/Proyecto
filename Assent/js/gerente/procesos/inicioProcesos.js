const nextBtn = document.getElementById('nextBtn');
const tableBody = document.getElementById('table-body');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
let products = [];

// Cargar datos desde el archivo JSON
fetch('/jsons/OrdenesDeCompra.json')
    .then(response => {
        if (!response.ok) throw new Error('Error al cargar el JSON');
        return response.json();
    })
    .then(data => {
        products = data; // Guardar los datos de productos
        loadTableData(); // Cargar los datos en la tabla
    })
    .catch(error => console.error('Error:', error));

// Función para llenar la tabla con los productos
function loadTableData(filteredProducts = products) {
    tableBody.innerHTML = ''; // Limpiar tabla

    filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" id="select_${product.id}" class="product-select"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.size}</td>
            <td>${product.date}</td>
            <td>${product.quantity}</td>
            <td>${product.description}</td>
            <td><button onclick="goToNextPage('${product.id}')"> 📦Compra</button>
             <button onclick="deleteProduct('${product.id}')"> 🗑️ Eliminar</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para eliminar un producto
function deleteProduct(productId) {
    // Filtrar el producto que no se va a eliminar
    products = products.filter(product => product.id !== productId);
    loadTableData(); // Actualizar la tabla para reflejar los cambios
    alert('Producto eliminado.');
}

// Función para manejar el botón de acciones por producto
function goToNextPage(productId) {
    const selectedProduct = products.find(product => product.id === productId);

    // Verificar si se ha seleccionado el producto
    const checkbox = document.getElementById(`select_${productId}`);
    if (checkbox && checkbox.checked) {
        if (selectedProduct) {
            localStorage.setItem('selectedProduct', JSON.stringify(selectedProduct));
            alert('Producto seleccionado: ' + selectedProduct.name);
            window.location.href = '/html/gerente/OrdenDeCompra/crearOrden/EnviarOrdenDeCompra.html';
        } else {
            alert('Producto no encontrado.');
        }
    } else {
        alert('Por favor, selecciona el producto antes de continuar.');
    }
}

// Función del botón "Siguiente" para manejar varios productos seleccionados
nextBtn.addEventListener('click', () => {
    const selectedProducts = [];

    products.forEach(product => {
        const checkbox = document.getElementById(`select_${product.id}`);
        if (checkbox.checked) {
            selectedProducts.push(product);
        }
    });

    if (selectedProducts.length > 0) {
        localStorage.setItem('OrdenCompraProducts', JSON.stringify(selectedProducts));
        alert(`${selectedProducts.length} productos seleccionados añadidos.`);
        window.location.href = '/html/gerente/OrdenDeCompra/crearOrden/EnviarOrdenDeCompra.html';
    } else {
        alert('No se ha seleccionado ningún producto.');
    }
});

// Función de búsqueda por nombre de producto
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm));
    loadTableData(filteredProducts); // Recargar la tabla con los productos filtrados
});

// Cargar los datos cuando la página esté lista
document.addEventListener('DOMContentLoaded', () => {
    // Ya manejamos la carga de productos en la promesa del fetch
});
