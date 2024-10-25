const nextBtn = document.getElementById('nextBtn');
const tableBody = document.getElementById('table-body');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

// Datos de ejemplo (puedes cargar estos datos desde otro lugar si prefieres)
const products = [
    { name: "Producto 1", category: "Categoría 1", size: "Pequeño", date: "2024-10-21", quantity: "10", description: "Descripción del producto 1" },
    { name: "Producto 2", category: "Categoría 2", size: "Mediano", date: "2024-10-22", quantity: "5", description: "Descripción del producto 2" },
    { name: "Producto 3", category: "Categoría 3", size: "Grande", date: "2024-10-23", quantity: "20", description: "Descripción del producto 3" }
];

// Función para llenar la tabla con los productos
function loadTableData(filteredProducts = products) {
    tableBody.innerHTML = ''; // Limpiar tabla

    filteredProducts.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" id="select_${index}" class="product-select"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.size}</td>
            <td>${product.date}</td>
            <td>${product.quantity}</td>
            <td>${product.description}</td>
            <td><button onclick="goToNextPage(${index})">Enviar Producto</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Cargar los datos cuando la página esté lista (invocar sin filtro)
document.addEventListener('DOMContentLoaded', () => {
    loadTableData();  // Asegurar que la tabla se cargue con todos los productos inicialmente
});

// Función para manejar el botón de acciones por producto
function goToNextPage(index) {
    const selectedProduct = products[index];
    localStorage.setItem('selectedProduct', JSON.stringify(selectedProduct));
    window.location.href = '/html/gerente/OrdenDeCompra/crearOrden/EnviarOrdenDeCompra.html';
}

// Función del botón "Siguiente" para manejar varios productos seleccionados
nextBtn.addEventListener('click', () => {
    const selectedProducts = [];

    products.forEach((product, index) => {
        const checkbox = document.getElementById(`select_${index}`);
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
