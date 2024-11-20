document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const addProductForm = document.getElementById("add-product-form");
    const productNameInput = document.getElementById("product-name");
    const completeSaleButton = document.getElementById("complete-sale");
    const totalPriceElement = document.getElementById("total-price");
    const notificationContainer = document.getElementById("notificaciones");
    const datalist = document.createElement("datalist");

    datalist.id = "product-options";
    productNameInput.setAttribute("list", "product-options");
    productNameInput.parentNode.appendChild(datalist);

    let totalPrice = 0;

    // Cargar productos al localStorage desde el JSON
    const loadProductsToLocalStorage = async () => {
        try {
            const response = await fetch("/jsons/productos.json");
            const products = await response.json();
            localStorage.setItem("products", JSON.stringify(products));
            populateDatalist(products);
        } catch (error) {
            console.error("Error al cargar los productos:", error);
        }
    };

    // Llenar el datalist con los nombres de los productos
    const populateDatalist = (products) => {
        datalist.innerHTML = "";
        products.forEach((product) => {
            const option = document.createElement("option");
            option.value = product.name;
            datalist.appendChild(option);
        });
    };

// Función para mostrar notificaciones de inventario bajo
function mostrarNotificacionesInventario() {
    const notificationContainer = document.getElementById("notificaciones");
    const products = JSON.parse(localStorage.getItem("products")) || [];

    // Limpiar notificaciones previas
    notificationContainer.innerHTML = ""; 

    // Filtrar productos con inventario bajo
    const lowStockProducts = products.filter(product => product.quantityToAdd <= product.quantityToAlert);

    if (lowStockProducts.length === 0) {
        notificationContainer.innerHTML = '<p>No hay alertas de inventario bajo.</p>';
        return;
    }

    // Crear notificaciones
    lowStockProducts.forEach(product => {
        const notification = document.createElement("div");
        notification.classList.add("notificacion");

        // Crear un botón para cada notificación con el enlace a la página de inventario bajo
        const button = document.createElement("button");
        button.classList.add("notification-button");
        button.textContent = `Inventario bajo: ${product.name} (${product.quantityToAdd} unidades)`;
        button.onclick = function() {
            // Redirigir a la página de inventario bajo
            window.location.href = "/html/gerente/OrdenDeCompra/InvetarioBajo.html";
        };

        notification.appendChild(button);
        notificationContainer.appendChild(notification);
    });
}

// Función para mostrar y ocultar el menú de notificaciones
function toggleNotifications() {
    const notificationMenu = document.getElementById("notificationMenu");
    notificationMenu.style.display = (notificationMenu.style.display === 'none' || notificationMenu.style.display === '') ? 'block' : 'none';
}

// Llamar a la función para mostrar las notificaciones cuando se carga la página
document.addEventListener("DOMContentLoaded", mostrarNotificacionesInventario);


    // Inicializar productos y datalist
    if (!localStorage.getItem("products")) {
        loadProductsToLocalStorage();
    } else {
        const products = JSON.parse(localStorage.getItem("products"));
        populateDatalist(products);
    }

    // Manejar entrada en el campo de producto
    productNameInput.addEventListener("input", () => {
        const products = JSON.parse(localStorage.getItem("products"));
        const productName = productNameInput.value;
        const product = products.find((p) => p.name === productName);

        if (product) {
            document.getElementById("price").value = product.sellingPrice.toFixed(2);
        } else {
            document.getElementById("price").value = "";
        }
    });

    // Agregar producto a la tabla
    addProductForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const products = JSON.parse(localStorage.getItem("products"));
        const productName = productNameInput.value;
        const quantity = parseInt(document.getElementById("quantity").value);

        const product = products.find((p) => p.name === productName);

        if (!product) {
            alert("Producto no encontrado.");
            return;
        }

        if (quantity > product.quantityToAdd) {
            alert("Cantidad insuficiente en el inventario.");
            return;
        }

        // Calcular subtotal, actualizar inventario y precio total
        const subtotal = product.sellingPrice * quantity;
        totalPrice += subtotal;
        product.quantityToAdd -= quantity;

        localStorage.setItem("products", JSON.stringify(products));

        // Crear fila en la tabla
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${quantity}</td>
            <td>$${product.sellingPrice.toFixed(2)}</td>
            <td>$${subtotal.toFixed(2)}</td>
            <td><button class="remove-item">Eliminar</button></td>
        `;
        productList.appendChild(row);

        // Actualizar total
        totalPriceElement.textContent = totalPrice.toFixed(2);

        // Verificar inventario bajo
        mostrarNotificacionesInventario();

        // Limpiar formulario
        addProductForm.reset();
    });

    // Eliminar producto de la tabla
    productList.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-item")) {
            const row = event.target.closest("tr");
            const productName = row.cells[0].textContent;
            const quantity = parseInt(row.cells[1].textContent);
            const subtotal = parseFloat(row.cells[3].textContent.replace("$", ""));

            const products = JSON.parse(localStorage.getItem("products"));
            const product = products.find((p) => p.name === productName);

            if (product) {
                product.quantityToAdd += quantity;
            }

            localStorage.setItem("products", JSON.stringify(products));

            totalPrice -= subtotal;
            totalPriceElement.textContent = totalPrice.toFixed(2);
            row.remove();

            // Verificar inventario bajo
            mostrarNotificacionesInventario();
        }
    });

    // Completar venta
    completeSaleButton.addEventListener("click", () => {
        if (totalPrice === 0) {
            alert("No hay productos en la venta.");
            return;
        }

        alert(`Venta completada. Total: $${totalPrice.toFixed(2)}`);

        // Aquí no hacemos una redirección inmediata para permitir ver las notificaciones
        // Si deseas redirigir a otra página después de completar la venta, puedes hacerlo aquí.
        window.location.href = "/html/gerente/inicio.html";
    });

    // Mostrar notificaciones al cargar
    mostrarNotificacionesInventario();
});
