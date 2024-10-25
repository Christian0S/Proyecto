// Datos de ejemplo para el inventario
const inventoryData = [
    { id: 1, proveedor: "Vanessa", estado: "Completado", productos: "Macetas, Flores", fecha: "2023-08-09", creadaPor: "Mateo", costo: "$56,444", cotizacionUrl: "cotizacion-1.html", pdfUrl: "documento-1.pdf" },
    { id: 2, proveedor: "Jose", estado: "Pendiente", productos: "Abono, Tierra", fecha: "2023-05-06", creadaPor: "Sofía", costo: "$54,564", cotizacionUrl: "cotizacion-2.html", pdfUrl: "documento-2.pdf" },
    { id: 3, proveedor: "Bob", estado: "Rechazado", productos: "Girasoles, Fertilizante", fecha: "2023-03-28", creadaPor: "Santiago", costo: "$45,998", cotizacionUrl: "cotizacion-3.html", pdfUrl: "documento-3.pdf" },
    { id: 4, proveedor: "Mario", estado: "Completado", productos: "Plantas, Semillas", fecha: "2023-04-12", creadaPor: "Valentina", costo: "$33,590", cotizacionUrl: "cotizacion-4.html", pdfUrl: "documento-4.pdf" },
    { id: 5, proveedor: "Ana", estado: "Pendiente", productos: "Piedras Decorativas", fecha: "2023-09-20", creadaPor: "Lucas", costo: "$72,160", cotizacionUrl: "cotizacion-5.html", pdfUrl: "documento-5.pdf" },
    { id: 6, proveedor: "Claudia", estado: "Completado", productos: "Macetas Grandes", fecha: "2023-10-04", creadaPor: "Carolina", costo: "$28,670", cotizacionUrl: "cotizacion-6.html", pdfUrl: "documento-6.pdf" },
    { id: 7, proveedor: "Luis", estado: "Rechazado", productos: "Tierra para Jardín", fecha: "2023-05-15", creadaPor: "Carlos", costo: "$47,250", cotizacionUrl: "cotizacion-7.html", pdfUrl: "documento-7.pdf" },
    { id: 8, proveedor: "Rosa", estado: "Completado", productos: "Plantas Medicinales", fecha: "2023-06-01", creadaPor: "Diego", costo: "$60,990", cotizacionUrl: "cotizacion-8.html", pdfUrl: "documento-8.pdf" },
    { id: 9, proveedor: "Oscar", estado: "Pendiente", productos: "Flores Exóticas", fecha: "2023-07-18", creadaPor: "Natalia", costo: "$36,420", cotizacionUrl: "cotizacion-9.html", pdfUrl: "documento-9.pdf" },
    { id: 10, proveedor: "Laura", estado: "Completado", productos: "Abono Especial", fecha: "2023-08-22", creadaPor: "Mariana", costo: "$49,350", cotizacionUrl: "cotizacion-10.html", pdfUrl: "documento-10.pdf" }
  ];
  
  // Función para cargar la tabla con los datos del inventario
  function cargarTablaInventario(data) {
    const tableBody = document.querySelector("#inventory-table tbody");
  
    // Limpiamos el contenido actual de la tabla antes de cargar nuevos datos
    tableBody.innerHTML = "";
  
    // Recorremos cada elemento en la lista de datos y creamos las filas dinámicamente
    data.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.proveedor}</td>
        <td>${item.estado}</td>
        <td>${item.productos}</td>
        <td>${item.fecha}</td>
        <td>${item.creadaPor}</td>
        <td>${item.costo}</td>
        <td>
          <button onclick="window.location.href='${item.cotizacionUrl}'">🔍</button>
          <button onclick="window.open('${item.pdfUrl}')">📄</button>
        </td>
      `;
      // Insertamos la nueva fila en el cuerpo de la tabla
      tableBody.appendChild(row);
    });
  }
  
  // Función para filtrar datos del inventario basados en un solo campo de búsqueda
  function filtrarInventario() {
    const searchQuery = document.getElementById("search").value.toLowerCase();
  
    // Filtrar los datos según el texto ingresado en el input
    const filteredData = inventoryData.filter(item => {
      return (
        item.proveedor.toLowerCase().includes(searchQuery) || 
        item.fecha.includes(searchQuery) || 
        item.creadaPor.toLowerCase().includes(searchQuery)
      );
    });
  
    // Volver a cargar la tabla con los datos filtrados
    cargarTablaInventario(filteredData);
  }
  
  // Función para limpiar el campo de búsqueda y recargar todos los datos
  function limpiarFiltro() {
    document.getElementById("search").value = "";
    cargarTablaInventario(inventoryData);
  }
  
  // Ejecutamos la función para cargar la tabla cuando la página se ha cargado completamente
  window.onload = function () {
    cargarTablaInventario(inventoryData);
  
    // Agregamos el evento para filtrar en base al campo de búsqueda
    document.getElementById("search").addEventListener("input", filtrarInventario);
    
    // Agregamos el evento para limpiar el filtro
    document.getElementById("btnLimpiar").addEventListener("click", limpiarFiltro);
  };
  