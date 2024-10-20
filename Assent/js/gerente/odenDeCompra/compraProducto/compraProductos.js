// Ejemplo de estructura de productos, esto debería cargarse desde tu JSON
const productos = [
    {
        id: 1,
        name: "Producto 1",
        category: "Artesanías",
        image: "/Assent/img/artesanias.png",
        description: "Descripción del Producto 1",
    },
    {
        id: 2,
        name: "Producto 2",
        category: "Plantas",
        image: "/Assent/img/plantas.png",
        description: "Descripción del Producto 2",
    }
    // Agrega más productos según sea necesario
];

// Llenar el selector de nombres de productos
const productNameSelect = document.getElementById("productName");
productos.forEach((producto) => {
    const option = document.createElement("option");
    option.value = producto.name;
    option.textContent = producto.name;
    productNameSelect.appendChild(option);
});

// Manejar el formulario de agregar productos
const productoForm = document.getElementById("productoForm");
productoForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe de la manera tradicional

    const productImage = document.getElementById("productImage").files[0];
    const productSize = document.getElementById("productSize").value;
    const deliveryDate = document.getElementById("deliveryDate").value;
    const productQuantity = document.getElementById("productQuantity").value;
    const productDescription = document.getElementById("productDescription").value;

    // Aquí puedes manejar la lógica para agregar el producto (enviarlo a un servidor o agregarlo a un array)
    // En este caso, solo lo mostraremos en la lista de productos
    const newProductId = productos.length + 1;
    const newProduct = {
        id: newProductId,
        name: productNameSelect.value,
        size: productSize,
        deliveryDate: deliveryDate,
        quantity: productQuantity,
        description: productDescription,
        image: URL.createObjectURL(productImage), // Crear un URL para la imagen
    };
    productos.push(newProduct);

    // Agregar el nuevo producto a la lista de productos registrados
    const productosUl = document.getElementById("productosUl");
    const li = document.createElement("li");
    li.innerHTML = `<strong>${newProduct.name}</strong><br>Size: ${newProduct.size}<br>Delivery: ${newProduct.deliveryDate}<br>Quantity: ${newProduct.quantity}<br><img src="${newProduct.image}" alt="${newProduct.name}" style="width: 50px;">`;
    productosUl.appendChild(li);

    // Limpiar el formulario después de agregar el producto
    productoForm.reset();
});
