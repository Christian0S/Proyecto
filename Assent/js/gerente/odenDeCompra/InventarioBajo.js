// Fetch JSON and display products
async function loadProducts() {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];

    try {
        const response = await fetch('/JSONs/productos.json');
        const jsonProducts = await response.json();

        // Fusionar los productos de localStorage y JSON, evitando duplicados
        const allProducts = [...storedProducts, ...jsonProducts];

        // Guardar todos los productos en localStorage (evita duplicados en el proceso)
        const uniqueProducts = allProducts.reduce((acc, current) => {
            const x = acc.find(item => item.id === current.id);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);

        localStorage.setItem('products', JSON.stringify(uniqueProducts));

        displayProducts(uniqueProducts);
        filterProducts(uniqueProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Display products in inventory grid
function displayProducts(products) {
    const inventoryGrid = document.getElementById('inventoryGrid');
    inventoryGrid.innerHTML = ''; // Clear previous content

    products.forEach(product => {
        // Only display low stock products (<= 20)
        if (product.quantityToAdd <= 20) { // Cambiar a quantityToAdd
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');

            // Create product HTML structure
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-img">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>Categoría: ${product.category}</p>
                    <p>Stock: ${product.quantityToAdd}</p> <!-- Cambiar a quantityToAdd -->
                </div>
            `;
            inventoryGrid.appendChild(productDiv);
        }
    });
}

// Filter products based on category
function filterProducts(products) {
    const filters = document.querySelectorAll('.filter-checkbox');
    filters.forEach(filter => {
        filter.addEventListener('change', () => {
            const selectedFilters = Array.from(filters)
                .filter(f => f.checked)
                .map(f => f.id.toLowerCase()); // Asegúrate de que todo esté en minúsculas

            // Filtrar productos si hay filtros seleccionados
            const filteredProducts = selectedFilters.length > 0
                ? products.filter(product =>
                    selectedFilters.includes(product.category.toLowerCase()) && product.quantityToAdd <= 20 // Cambiar a quantityToAdd
                  )
                : products; // Si no hay filtros, muestra todos los productos

            displayProducts(filteredProducts);
        });
    });
}

// Llamar a la función de cargar productos al cargar la página
window.onload = loadProducts;
