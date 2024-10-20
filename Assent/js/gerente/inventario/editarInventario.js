// Variable global para almacenar datos del usuario
let userData;

// Función para obtener datos del usuario desde localStorage o sessionStorage
function getUserData() {
    const storedUserData = JSON.parse(localStorage.getItem('userData')); // O usa sessionStorage si es necesario

    if (storedUserData) {
        return {
            nombre: storedUserData.nombre || 'Usuario', // Nombre por defecto
            rol: storedUserData.rol || 'Rol desconocido' // Rol por defecto
        };
    } else {
        return {
            nombre: 'Usuario', // Nombre por defecto si no hay datos
            rol: 'Rol desconocido' // Rol por defecto si no hay datos
        };
    }
}

// Función para cargar proveedores desde el JSON y localStorage
function loadSuppliers() {
    const supplierSelect = document.getElementById('supplierSelect');

    // Cargar proveedores desde el archivo JSON
    fetch('/JSONs/proveedores.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                console.log('No se encontraron proveedores en el JSON.');
            }
            data.forEach(supplier => {
                if (supplier.id && supplier.nombre) {
                    const option = document.createElement('option');
                    option.value = supplier.id;
                    option.textContent = `${supplier.nombre} ${supplier.apellidos || ''}`;
                    supplierSelect.appendChild(option);
                }
            });
        })
        .catch(error => console.error('Error al cargar proveedores del JSON:', error));

    // Cargar proveedores desde localStorage
    const localSuppliers = JSON.parse(localStorage.getItem('suppliers')) || [];
    localSuppliers.forEach(supplier => {
        if (supplier.id && supplier.nombre) {
            const option = document.createElement('option');
            option.value = supplier.id;
            option.textContent = supplier.nombre;
            supplierSelect.appendChild(option);
        }
    });
}

// Función para cargar la información de creación al cargar la página
function loadCreationInfo() {
    userData = getUserData(); // Obtener datos del usuario y guardarlos en la variable global

    // Mostrar el nombre y rol del usuario
    document.getElementById('creatorName').textContent = userData.nombre;
    document.getElementById('creatorRole').textContent = userData.rol;
    document.getElementById('creationDate').textContent = new Date().toLocaleDateString(); // Mostrar la fecha actual
}
// Cargar producto para edición
function loadProductForEditing() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    if (productId) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products.find(item => item.id === parseInt(productId));

        if (product) {
            // Rellenar los campos del formulario con los datos del producto
            document.getElementById('productName').value = product.name || '';
            document.getElementById('categorySelect').value = product.category || '';
            document.getElementById('supplierSelect').value = product.supplierId || '';
            document.getElementById('basePrice').value = product.basePrice || 0;
            document.getElementById('UltPercentage').value = product.ultPercentage || 0;
            document.getElementById('VenPrice').value = product.sellingPrice || 0;
            document.getElementById('vatPercentage').value = product.vatPercentage || 0;
            document.getElementById('priceWithVAT').value = product.priceWithVAT || 0;
            document.getElementById('quantityToAdd').value = product.quantityToAdd || 0;
            document.getElementById('quantityToAlert').value = product.quantityToAlert || 0;
            document.getElementById('productImage').src = product.image || '/Assent/img/default-avatar.jpeg';

            // Cargar la descripción en el campo correspondiente
            document.getElementById('descriptionText').value = product.description || ''; // Asegúrate de que este sea el ID correcto del campo de descripción

            // Cargar información de quien creó el producto
            if (product.createdBy) {
                document.getElementById('creatorName').textContent = product.createdBy.name || '';
                document.getElementById('creatorRole').textContent = product.createdBy.role || '';
                document.getElementById('creationDate').textContent = product.createdBy.date || new Date().toLocaleDateString();
            }
        } else {
            console.error('Producto no encontrado en localStorage con el ID:', productId);
        }
    } else {
        console.error('No se proporcionó un ID de producto en la URL.');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM completamente cargado.');
    loadSuppliers(); // Cargar proveedores
    loadCreationInfo(); // Cargar información del creador
    loadProductForEditing(); // Cargar producto para editar
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM completamente cargado.');
    loadSuppliers(); // Cargar proveedores
    loadCreationInfo(); // Cargar información del creador
    loadProductForEditing(); // Cargar producto para editar

    // Función para cargar la imagen del producto
    window.loadImage = function(event) {
        const reader = new FileReader();
        reader.onload = function() {
            const productImage = document.getElementById('productImage');
            productImage.src = reader.result; // Cambiar la fuente de la imagen
            productImage.style.display = 'block'; // Hacer visible la imagen
        };
        reader.readAsDataURL(event.target.files[0]); // Leer el archivo como Data URL
    };

    // Guardar descripción en localStorage
    window.saveDescription = function() {
        const descriptionText = document.getElementById('descriptionText').value;
        localStorage.setItem('productDescription', descriptionText);
        toggleDescriptionPopup();
    };

    // Alternar la visibilidad del popup de descripción
    window.toggleDescriptionPopup = function() {
        const descriptionPopup = document.getElementById('descriptionPopup');
        descriptionPopup.style.display = descriptionPopup.style.display === 'none' ? 'block' : 'none';
    };

    // Calcular y mostrar precios
    function calculatePrices() {
        const basePrice = parseFloat(document.getElementById('basePrice').value);
        const ultPercentage = parseFloat(document.getElementById('UltPercentage').value);
        const vatPercentage = parseFloat(document.getElementById('vatPercentage').value);

        let sellingPrice; // Definir la variable aquí

        if (!isNaN(basePrice) && !isNaN(ultPercentage)) {
            sellingPrice = basePrice + (basePrice * (ultPercentage / 100));
            document.getElementById('VenPrice').value = sellingPrice.toFixed(2); // Actualiza el precio de venta
        }

        if (!isNaN(sellingPrice) && !isNaN(vatPercentage)) {
            const priceWithVAT = sellingPrice + (sellingPrice * (vatPercentage / 100));
            document.getElementById('priceWithVAT').value = priceWithVAT.toFixed(2); // Actualiza el precio de venta con IVA
        }
    }

    // Añadir eventos de cambio para calcular precios al introducir datos
    document.getElementById('basePrice').addEventListener('input', calculatePrices);
    document.getElementById('UltPercentage').addEventListener('input', calculatePrices);
    document.getElementById('vatPercentage').addEventListener('input', calculatePrices);

    // Guardar producto
    document.querySelector('.save-button').addEventListener('click', function() {
        const productName = document.getElementById('productName').value;
        const categorySelect = document.getElementById('categorySelect').value;
        const supplierSelect = document.getElementById('supplierSelect').value;
        const basePrice = parseFloat(document.getElementById('basePrice').value);
        const ultPercentage = parseFloat(document.getElementById('UltPercentage').value);
        const sellingPrice = parseFloat(document.getElementById('VenPrice').value);
        const vatPercentage = parseFloat(document.getElementById('vatPercentage').value);
        const priceWithVAT = parseFloat(document.getElementById('priceWithVAT').value);
        const quantityToAdd = parseInt(document.getElementById('quantityToAdd').value);
        const quantityToAlert = parseInt(document.getElementById('quantityToAlert').value);
        const productImage = document.getElementById('productImage').src;
        const productDescription = document.getElementById('descriptionText').value || ''; // Obtener la descripción del campo de texto

        // Validaciones
        if (!productName || !categorySelect || !supplierSelect || isNaN(basePrice) || isNaN(ultPercentage) || isNaN(vatPercentage) || quantityToAdd < 1) {
            alert("Por favor, completa todos los campos requeridos.");
            return;
        }

        // Generar un ID único para el nuevo producto
        let products = JSON.parse(localStorage.getItem('products')) || [];
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');

        const product = {
            id: productId ? parseInt(productId) : (products.length ? products[products.length - 1].id + 1 : 1), // Usar el ID existente si se está editando
            name: productName,
            category: categorySelect,
            supplierId: supplierSelect,
            basePrice: basePrice,
            ultPercentage: ultPercentage,
            sellingPrice: sellingPrice,
            vatPercentage: vatPercentage,
            priceWithVAT: priceWithVAT,
            quantityToAdd: quantityToAdd,
            quantityToAlert: quantityToAlert,
            image: productImage,
            description: productDescription,
            createdBy: {
                name: userData.nombre,
                role: userData.rol,
                date: new Date().toLocaleDateString()
            },
            isEdited: true // Marcar como editado
        };

        // Si el ID está presente, se está editando
        if (productId) {
            const productIndex = products.findIndex(item => item.id === parseInt(productId));
            if (productIndex !== -1) {
                products[productIndex] = product; // Actualiza el producto original
            }
        } else {
            // Agregar como nuevo producto
            products.push(product);
        }

        // Guardar en localStorage
        localStorage.setItem('products', JSON.stringify(products));

        alert("Producto guardado exitosamente.");
        // Redirigir a la página de listado de productos
        window.location.href = '/Html/Inventario/ListadoHistorial.html';
    });

    // Cancelar acción
    document.querySelector('.cancel-button').addEventListener('click', function() {
        window.location.href = '/Html/Inventario/ListadoHistorial.html';
    });
});