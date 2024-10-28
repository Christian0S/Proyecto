// Referencia al contenedor de formularios y al botón de añadir productos
const formContainer = document.getElementById('formContainer');
const addProductBtn = document.getElementById('addProductBtn');
const nextBtn = document.getElementById('nextBtn');

// Contador para generar ID únicos para cada tarjeta
let productCounter = 0;

// Función para obtener los parámetros de consulta de la URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        filtro: params.get('filtro'),
        id: params.get('id')
    };
}

// Cargar productos filtrados o detalles de un producto por ID
async function loadProductData() {
    const { filtro, id } = getQueryParams();

    try {
        const response = await fetch('/jsons/productos.json');
        const products = await response.json();

        // Limpiar el contenedor antes de cargar nuevos productos
        formContainer.innerHTML = ''; 

        if (id) {
            // Si hay un ID, cargar el producto específico
            const product = products.find(p => p.id == id);
            if (product) {
                addProductForm(product); // Cargar el formulario con los detalles del producto
            }
        } else if (filtro) {
            // Si hay un filtro, cargar solo un producto de la categoría
            const filteredProduct = products.find(product => product.category.toLowerCase() === filtro.toLowerCase());
            if (filteredProduct) {
                addProductForm({
                    image: '/Assent/img/profile/default-avatar.jpeg',
                    name: '',
                    description: '',
                    size: '',
                    category: filteredProduct.category });
                    console.log('Categoría filtrada:', filteredProduct.category);

                 // Cargar formulario solo para el primer producto que coincida
            }
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

async function suggestProducts(input, productCounter) {
    const categorySelect = document.getElementById(`productCategory_${productCounter}`);
    const category = categorySelect.value; // Obtener la categoría seleccionada
    const suggestionsContainer = document.getElementById(`suggestionsContainer_${productCounter}`);
    suggestionsContainer.innerHTML = ''; // Limpiar sugerencias anteriores

    if (input) {
        try {
            const response = await fetch('/jsons/productos.json'); // Cambia esta ruta si es necesario
            const productsData = await response.json(); // Cargar los productos desde el JSON

            // Filtrar productos utilizando los nombres del JSON y la categoría seleccionada
            const filteredSuggestions = productsData.filter(product => 
                product.name.toLowerCase().includes(input.toLowerCase()) &&
                product.category === category // Filtrar por categoría
            );

            filteredSuggestions.forEach(product => {
                const suggestionItem = document.createElement('div');
                suggestionItem.classList.add('suggestion-item');
                suggestionItem.textContent = product.name; // Asumimos que el JSON tiene una propiedad "name"

                suggestionItem.addEventListener('click', () => {
                    // Establecer los valores en los inputs del formulario
                    document.getElementById(`productName_${productCounter}`).value = product.name; // Establecer el valor en el input de nombre
                    document.getElementById(`productCategory_${productCounter}`).value = product.category; // Establecer el valor en el select de categoría
                    document.getElementById(`productDescription_${productCounter}`).value = product.description; // Establecer la descripción
                    document.getElementById(`productPreview_${productCounter}`).src = product.image; // Actualizar la imagen
                    document.getElementById(`productSize_${productCounter}`).value = ''; // Aquí puedes establecer un valor específico si es necesario
                    document.getElementById(`productQuantity_${productCounter}`).value = product.quantityToAdd; // Establecer cantidad
                    suggestionsContainer.innerHTML = ''; // Limpiar sugerencias
                });

                suggestionsContainer.appendChild(suggestionItem);
            });

            // Si no hay sugerencias, puedes mostrar un mensaje
            if (filteredSuggestions.length === 0) {
                const noSuggestionsItem = document.createElement('div');
                noSuggestionsItem.classList.add('suggestion-item');
                noSuggestionsItem.textContent = 'No hay coincidencias';
                suggestionsContainer.appendChild(noSuggestionsItem);
            }
        } catch (error) {
            console.error('Error al cargar el JSON:', error);
        }
    }
}

// Evento para añadir una nueva tarjeta de producto
addProductBtn.addEventListener('click', () => {
    addProductForm(); // Llamamos a la función para agregar un nuevo formulario
});
// Función para añadir una tarjeta de producto
function addProductForm(product) {
    productCounter++; // Incrementamos el contador para cada nueva tarjeta

    // Creamos un nuevo div para la tarjeta del producto
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    // Si se pasa un producto, usamos sus datos; de lo contrario, campos vacíos
    const nameValue = product ? product.name : '';
    const categoryValue = product ? product.category : '';
    const descriptionValue = product ? product.description : '';
    const sizeValue = ''; // Para la característica del tamaño
    const DateValue = '';
    const quantityValue = product ? product.quantity : ''; // Para la cantidad
    const imageValue = product ? product.image : '/Assent/img/profile/default-avatar.jpeg';

    // Contenido HTML del formulario de producto
    productCard.innerHTML = `
        <div class="form-group">
            <label for="imageInput_${productCounter}" class="image-label">
                <img id="productPreview_${productCounter}" src="${imageValue}" alt="Imagen del Producto" class="image-preview">
                <input type="file" id="imageInput_${productCounter}" accept="image/*" class="image-input">
            </label>
        </div>
        <div class="form-group">
            <label for="productName_${productCounter}">Nombre del Producto:</label>
            <input type="text" id="productName_${productCounter}" value="${nameValue}" placeholder="Ej. Planta de interior" oninput="suggestProducts(this.value, ${productCounter})">
            <div id="suggestionsContainer_${productCounter}" class="suggestions-container"></div> <!-- Contenedor para sugerencias único -->
        </div>
        <div class="form-group">
            <label for="productCategory_${productCounter}">Categoría:</label>
            <select id="productCategory_${productCounter}">
                <option value="Materas" ${categoryValue === 'Materas' ? 'selected' : ''}>Materas</option>
                <option value="Artesanías" ${categoryValue === 'Artesanías' ? 'selected' : ''}>Artesanías</option>
                <option value="Plantas" ${categoryValue === 'Plantas' ? 'selected' : ''}>Plantas</option>
                <option value="Abonos-Tierra" ${categoryValue === 'Abonos-Tierra' ? 'selected' : ''}>Abonos-Tierra</option>
            </select>
        </div>
        <div class="form-group">
            <label for="productSize_${productCounter}">Características:</label>
            <input type="text" id="productSize_${productCounter}" value="${sizeValue}" placeholder="Tamaño, Color, etc.">
        </div>
        <div class="form-group">
            <label for="productDate_${productCounter}">Date:</label>
            <input type="date" id="productDate_${productCounter}" value="${DateValue}" placeholder="Ej. 10" min="1">
        </div>
        <div class="form-group">
            <label for="productQuantity_${productCounter}">Cantidad:</label>
            <input type="number" id="productQuantity_${productCounter}" value="${quantityValue}" placeholder="Ej. 10" min="1">
        </div>
        <div class="form-group">
            <label for="productDescription_${productCounter}">Descripción:</label>
            <textarea id="productDescription_${productCounter}" rows="3" placeholder="Descripción del producto...">${descriptionValue}</textarea>
        </div>
        <button class="delete-btn" onclick="removeProductForm(this)">🗑️</button>
    `;

    // Evento para mostrar la vista previa de la imagen cuando se seleccione un archivo
    const imageInput = productCard.querySelector(`#imageInput_${productCounter}`);
    const imagePreview = productCard.querySelector(`#productPreview_${productCounter}`);

    imageInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Insertamos la nueva tarjeta al contenedor
    formContainer.appendChild(productCard);

    // Actualizamos la posición del botón "Siguiente"
    updateNextButtonPosition();
}
// Función para eliminar una tarjeta de producto
function removeProductForm(button) {
    const productCard = button.parentElement;
    formContainer.removeChild(productCard);
    updateNextButtonPosition(); // Actualizar la posición del botón "Siguiente" después de eliminar
}


//  botón siguiente función 
nextBtn.addEventListener('click', () => {
    const products = [];

    formContainer.querySelectorAll('.product-card').forEach(card => {
        const name = card.querySelector('input[id^="productName_"]').value;
        const category = card.querySelector('select[id^="productCategory_"]').value;
        const size = card.querySelector('input[id^="productSize_"]').value;
        const date = card.querySelector('input[id^="productDate_"]').value;
        const quantity = card.querySelector('input[id^="productQuantity_"]').value;
        const description = card.querySelector('textarea[id^="productDescription_"]').value;

        const imageInput = card.querySelector('input[id^="imageInput_"]');
        const imagePreview = card.querySelector('img[id^="productPreview_"]');

        const imageFile = imageInput.files.length > 0 ? imageInput.files[0].name : null;
        const image = imageFile ? imageFile : imagePreview.src;

        // Comprueba si todos los campos necesarios están llenos
        if (name && category && size && description && image && date && quantity) {
            products.push({
                name: name,
                category: category,
                size: size,
                date: date,
                quantity: quantity,
                description: description,
                image: image
            });
        } else {
            console.log('Algunos campos están vacíos en la tarjeta del producto:', { name, category, size, description, image, date, quantity });
        }
    });

    console.log('Productos recopilados:', products); // Ver cuántos productos se han recopilado

    if (products.length > 0) {
        localStorage.setItem('OrdenCompraProducts', JSON.stringify(products));
        alert(`${products.length} productos añadidos.`);
        window.location.href = '/html/gerente/OrdenDeCompra/crearOrden/EnviarOrdenDeCompra.html';
    } else {
        alert('No se ha añadido ningún producto.');
    }
});





// Llamar a la función para cargar productos al cargar la página
window.onload = loadProductData;
