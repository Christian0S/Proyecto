// Variable global para almacenar datos del usuario
let userData; // Definir aquí

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
            data.forEach(supplier => {
                if (supplier.id && supplier.nombre) {
                    const option = document.createElement('option');
                    option.value = supplier.id; // Guardar el ID del proveedor
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
            option.value = supplier.id; // Guardar el ID del proveedor
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

// Función para actualizar el listado de productos del proveedor
function updateSupplierProducts(supplierId, newProductName) {
    const suppliers = JSON.parse(localStorage.getItem('suppliers')) || [];

    // Buscar el proveedor por su ID
    const supplier = suppliers.find(supplier => supplier.id === parseInt(supplierId));
    if (supplier) {
        // Verificar si el producto ya está en la lista
        if (!supplier.productos.includes(newProductName)) {
            supplier.productos.push(newProductName); // Añadir el nuevo producto
            localStorage.setItem('suppliers', JSON.stringify(suppliers)); // Guardar la lista actualizada en localStorage
            console.log(`Producto "${newProductName}" añadido al proveedor ${supplier.nombre}.`);
        } else {
            console.log(`El producto "${newProductName}" ya está en la lista de productos del proveedor.`);
        }
    } else {
        console.error(`Proveedor con ID ${supplierId} no encontrado.`);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadSuppliers(); // Cargar proveedores
    loadCreationInfo(); // Cargar información del creador

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
        const supplierId = document.getElementById('supplierSelect').value;  // Usar ID del proveedor
        const basePrice = parseFloat(document.getElementById('basePrice').value);
        const ultPercentage = parseFloat(document.getElementById('UltPercentage').value);
        const sellingPrice = parseFloat(document.getElementById('VenPrice').value);
        const vatPercentage = parseFloat(document.getElementById('vatPercentage').value);
        const priceWithVAT = parseFloat(document.getElementById('priceWithVAT').value);
        const quantityToAdd = parseInt(document.getElementById('quantityToAdd').value);
        const quantityToAlert = parseInt(document.getElementById('quantityToAlert').value);
        const productImage = document.getElementById('productImage').src;
        const productDescription = localStorage.getItem('productDescription') || '';

        // Generar un ID único para el nuevo producto
        let products = JSON.parse(localStorage.getItem('products')) || [];
        const newProductId = products.length ? products[products.length - 1].id + 1 : 1;  // Incrementar el ID

        const product = {
            id: newProductId,
            name: productName,
            category: categorySelect,
            supplierId: supplierId, // Guardar el ID del proveedor
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
                name: userData.nombre, // Usar la variable global
                role: userData.rol,    // Usar la variable global
                date: new Date().toLocaleDateString()
            }
        };

        // Guardar producto en localStorage
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));

        // Actualizar la lista de productos del proveedor
        updateSupplierProducts(supplierId, productName);

        alert("Producto guardado exitosamente."); // Muestra mensaje solo si se guardó
        // Redirigir a la página de listado de productos
        window.location.href = '/html/gerente/Inventario/listadoDeInventario.html';
    });

    // Cancelar acción
    document.querySelector('.cancel-button').addEventListener('click', function() {
        window.location.href = '/html/gerente/Inventario/listadoDeInventario.html';
    });
});
