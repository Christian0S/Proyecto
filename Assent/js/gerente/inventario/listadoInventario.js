const inventoryData = []; // Para almacenar los datos del inventario

async function loadInventory() {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    const productListContainer = document.getElementById('productList');

    try {
        const response = await fetch('/JSONs/productos.json'); // Asegúrate de que la ruta es correcta
        const jsonProducts = await response.json();

        // Fusionar los productos de localStorage y JSON, evitando duplicados
        const allProducts = [...storedProducts, ...jsonProducts];

        // Filtrar productos para eliminar los que han sido editados
        const filteredProducts = allProducts.filter(product => !product.isEdited);

        // Guardar todos los productos en localStorage (evita duplicados en el proceso)
        const uniqueProducts = filteredProducts.reduce((acc, current) => {
            const x = acc.find(item => item.id === current.id);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);

        localStorage.setItem('products', JSON.stringify(uniqueProducts));

        inventoryData.push(...uniqueProducts); // Almacena los datos en la variable
        renderInventory(inventoryData); // Renderiza los datos en la tabla
    } catch (error) {
        console.error("Error al cargar el inventario:", error);
    }
}


function renderInventory(data) {
    const inventoryBody = document.getElementById('inventoryBody');
    inventoryBody.innerHTML = ''; // Limpia la tabla antes de renderizar
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name || 'N/A'}</td>
            <td>${item.category || 'N/A'}</td>
            <td>${item.quantityToAdd || 0}</td> <!-- Cambiar a quantityToAdd -->
            <td>${item.priceWithVAT || 0}</td> <!-- Cambiar a priceWithVAT -->
            <td>
                <button onclick="editProduct(${item.id})">✏️</button>
                <button onclick="deleteProduct(${item.id})">❌</button>
            </td>
        `;
        inventoryBody.appendChild(row);
    });
}

// Filtrar productos por nombre o categoría
function filterInventory() {
    const filterInput = document.getElementById('filterInput').value.toLowerCase();
    const filteredData = inventoryData.filter(item => 
        (item.name && item.name.toLowerCase().includes(filterInput)) || 
        (item.category && item.category.toLowerCase().includes(filterInput))
    );
    renderInventory(filteredData); // Renderiza los datos filtrados
}

// Funciones para agregar, editar y eliminar productos
function addProduct() {
    // Implementa la lógica para agregar un producto
}

function editProduct(id) {
    // Redirigir a la página de edición de productos, pasando el ID del producto en la URL
    window.location.href = `/html/gerente/Inventario/editarInventario.html?id=${id}`;
}


function deleteProduct(id) {
    const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (confirmDelete) {
        const index = inventoryData.findIndex(item => item.id === id);
        if (index !== -1) {
            inventoryData.splice(index, 1); // Elimina el producto del array
            renderInventory(inventoryData); // Renderiza la tabla actualizada
        }
    }
}

// Cargar el inventario al cargar la página
window.onload = loadInventory;
