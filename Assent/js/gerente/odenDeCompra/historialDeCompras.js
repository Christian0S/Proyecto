// Función para cargar los datos desde un archivo JSON
async function cargarDatosInventario() {
  try {
      const response = await fetch('/jsons/HistoriaComprea.json'); // Reemplaza por la ruta correcta del JSON
      const data = await response.json();
      inventoryData = data;
      cargarTablaInventario(data); // Cargamos la tabla directamente después de cargar los datos
  } catch (error) {
      console.error('Error al cargar los datos del inventario:', error);
  }
}

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
              <button onclick="generarInformeCompra(${item.id})">📄</button>
          </td>
      `;
      // Insertamos la nueva fila en el cuerpo de la tabla
      tableBody.appendChild(row);
  });
}

// Función para mostrar las compras realizadas por un proveedor específico
function mostrarComprasProveedor(proveedor) {
  // Filtrar los datos del proveedor seleccionado
  const comprasProveedor = inventoryData.filter(item => item.proveedor === proveedor);
  
  // Generar un listado con la información de las compras realizadas
  let listadoCompras = `Compras realizadas por ${proveedor}:\n\n`;
  comprasProveedor.forEach(compra => {
      listadoCompras += `- Fecha: ${compra.fecha}, Productos: ${compra.productos}, Costo: ${compra.costo}\n`;
  });

  // Mostrar el listado en un alerta o puedes agregarlo a una sección de la página
  alert(listadoCompras || "No se encontraron compras para este proveedor.");
}

function generarInformePorFecha() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  if (!startDate || !endDate) {
      alert("Por favor, selecciona un rango de fechas válido.");
      return;
  }

  // Filtrar los datos según el rango de fechas seleccionado
  const filteredData = inventoryData.filter(item => {
      const fechaCompra = new Date(item.fecha);
      return fechaCompra >= new Date(startDate) && fechaCompra <= new Date(endDate);
  });

  if (filteredData.length === 0) {
      alert("No se encontraron compras en este rango de fechas.");
      return;
  }

  // Generar el PDF con los datos filtrados
  generarPDF(filteredData, startDate, endDate);
}

function generarPDF(data, startDate, endDate) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Encabezado
  doc.setFontSize(18);
  doc.text("Informe de Compras", 20, 20);
  doc.setFontSize(12);
  doc.text(`Período: ${startDate} a ${endDate}`, 20, 30);
  
  // Agregar logo (opcional)
  const logo = new Image();
  logo.src = '/Assent/img/idex-createProfile/logo.png'; // Cambia esta ruta a la ubicación de tu logo
  const maxLineWidth = 180
  logo.onload = function() {
      doc.addImage(logo, 'PNG', 150, 10, 50, 20); // Ajusta posición y tamaño del logo

      // Texto descriptivo
      doc.setFontSize(12);
      doc.text("Este informe detalla las compras realizadas en el período indicado, incluyendo proveedores y productos adquiridos.", 20, 50, {
        maxWidth: maxLineWidth});
      
      doc.text("Por favor, revisa la información y si necesitas más detalles, no dudes en contactar al proveedor correspondiente.", 20, 70, {
        maxWidth: maxLineWidth});
      
      // Cabecera de la tabla
      doc.text("Nº  Proveedor       Productos       Fecha        Costo Total", 20, 90);
      doc.line(20, 82, 190, 82); // Línea debajo del encabezado

      // Insertar cada fila de datos
      let yPosition = 100;
      data.forEach((item, index) => {
          doc.text(`${item.id}  ${item.proveedor}   ${item.productos}   ${item.fecha}   $${parseFloat(item.costo.replace(/[^0-9.-]+/g,"")).toLocaleString()}`, 20, yPosition);
          yPosition += 10;

          // Verificar si se debe crear una nueva página
          if (yPosition > 280) {
              doc.addPage();
              yPosition = 20;
          }
      });

      // Total de compras en el período
      const totalCompras = data.reduce((sum, item) => {
          return sum + parseFloat(item.costo.replace(/[^0-9.-]+/g,""));
      }, 0);

      doc.setFontSize(14);
      doc.text(`Total de compras: $${totalCompras.toLocaleString()}`, 20, yPosition + 10);
      
      // Conclusión
      doc.setFontSize(12);
      doc.text("Conclusión: Este informe proporciona un resumen completo de las transacciones realizadas.", 20, yPosition + 20);
      doc.text("Asegúrate de llevar un registro adecuado de las compras para facilitar futuras referencias.", 20, yPosition + 30);

      // Guardar el PDF
      doc.save(`informe_compras_${startDate}_a_${endDate}.pdf`);
  };
}

function generarInformeCompra(idCompra) {
  const compra = inventoryData.find(item => item.id === idCompra);
  
  if (!compra) {
      alert("No se encontró la compra.");
      return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Encabezado
  doc.setFontSize(22);
  doc.text("Informe de Compra", 20, 20);
  
  // Agregar logo (opcional)
  const logo = new Image();
  logo.src = '/Assent/img/idex-createProfile/logo.png'; // Cambia esta ruta a la ubicación de tu logo
  logo.onload = function() {
      doc.addImage(logo, 'PNG', 150, 10, 40, 30); // Ajustar tamaño y posición del logo

      // Detalles de la compra
      doc.setFontSize(12);
      doc.text(`Proveedor: ${compra.proveedor}`, 20, 40);
      doc.text(`Productos: ${compra.productos}`, 20, 50);
      doc.text(`Fecha: ${compra.fecha}`, 20, 60);
      doc.text(`Costo Total: $${parseFloat(compra.costo.replace(/[^0-9.-]+/g,"")).toLocaleString()}`, 20, 70);
      
      // Agregar una línea separadora
      doc.line(20, 75, 190, 75); // Línea horizontal
      doc.text("Detalles adicionales:", 20, 80);

      // Añadir algún texto extra para hacer el informe más informativo
      doc.text("Este informe proporciona un resumen detallado de la compra.", 20, 90);
      doc.text("Si tienes preguntas sobre esta compra, no dudes en contactar al proveedor.", 20, 100);
      
      // Guardar el PDF
      doc.save(`informe_compra_${compra.id}.pdf`);
  };
}

// Función para filtrar datos del inventario basados en un solo campo de búsqueda
function filtrarInventario(data) {
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

function toggleCalendario() {
  const calendario = document.getElementById('calendario-container');
  calendario.style.display = calendario.style.display === 'none' ? 'block' : 'none';
}

// Ejecutamos la función para cargar la tabla cuando la página se ha cargado completamente
window.onload = function () {
  cargarDatosInventario(); // Cargar los datos desde el archivo JSON

  // Agregamos el evento para filtrar en base al campo de búsqueda
  document.getElementById("search").addEventListener("input", filtrarInventario);
}
