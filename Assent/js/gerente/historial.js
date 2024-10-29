// Declarar registrosFiltrados globalmente
let registrosFiltrados = [];

// Cargar los registros desde un archivo JSON
async function cargarRegistros() {
    try {
        const response = await fetch('/jsons/historialDecambios.json'); // Asegúrate de que la ruta sea correcta
        if (!response.ok) {
            throw new Error('Error al cargar los registros');
        }
        const registros = await response.json();

        // Filtrar los registros para excluir aquellos con rol "proveedor"
        registrosFiltrados = registros.filter(registro => registro.rol !== 'Proveedor');

        const tabla = document.getElementById("registroTabla");
        tabla.innerHTML = ""; // Limpiar el contenido de la tabla antes de cargar

        registrosFiltrados.forEach(registro => {
            const fila = document.createElement("tr");

            // Crear las celdas
            const celdaID = document.createElement("td");
            celdaID.textContent = registro.id;

            const celdaUsuario = document.createElement("td");
            celdaUsuario.textContent = registro.usuario;

            const celdaRol = document.createElement("td");
            celdaRol.textContent = registro.rol;

            const celdaAccion = document.createElement("td");
            celdaAccion.textContent = registro.accion;

            const celdaDescripcion = document.createElement("td");
            celdaDescripcion.textContent = registro.descripcion;

            const celdaFechaHora = document.createElement("td");
            celdaFechaHora.textContent = registro.fechaHora;

            const celdaEtc = document.createElement("td");
            const boton = document.createElement("button");
            boton.textContent = "📄";
            boton.onclick = () => generateReport(registro); // Función para generar el informe
            celdaEtc.appendChild(boton);

            // Añadir las celdas a la fila
            fila.appendChild(celdaID);
            fila.appendChild(celdaUsuario);
            fila.appendChild(celdaRol);
            fila.appendChild(celdaAccion);
            fila.appendChild(celdaDescripcion);
            fila.appendChild(celdaFechaHora);
            fila.appendChild(celdaEtc);

            // Añadir la fila a la tabla
            tabla.appendChild(fila);
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al cargar los registros.');
    }
}

// Función para generar un informe detallado en PDF
function generateReport(registro) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const empresa = "Vivero Las Magnolias"; // Nombre de la empresa
    const fechaCreacion = new Date().toLocaleDateString(); // Fecha de creación del informe

    // Formato del contenido
    const contenido = `
        Informe de Historial de Cambios
        -----------------------
        Empresa: ${empresa}
        Fecha de Creación: ${fechaCreacion}
        ID: ${registro.id}
        Usuario: ${registro.usuario}
        Rol: ${registro.rol}
        Acción: ${registro.accion}
        Descripción: ${registro.descripcion}
        Fecha y Hora: ${registro.fechaHora}
        
        Detalles del cambio:
        Este registro fue generado por el usuario ${registro.usuario} con rol de ${registro.rol}.
        La acción consiste en ${registro.accion}, realizada el ${registro.fechaHora}.
    `;

    // Añadir contenido al PDF
    doc.setFontSize(12);
    doc.text(contenido, 10, 10); // Ajusta la posición (10, 10) según sea necesario
    
    // Generar el PDF
    doc.save(`historial_cambios_${registro.id}.pdf`);
}

// Filtrar la tabla por búsqueda
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", function() {
    let filter = searchInput.value.toLowerCase();
    let rows = document.getElementById("registroTabla").getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        let cells = rows[i].getElementsByTagName("td");
        let match = false;
        for (let j = 0; j < cells.length - 1; j++) {
            if (cells[j].textContent.toLowerCase().indexOf(filter) > -1) {
                match = true;
                break;
            }
        }
        rows[i].style.display = match ? "" : "none"; // Mostrar o esconder fila
    }
});

function toggleCalendario() {
    const calendario = document.getElementById('calendario-container');
    calendario.style.display = calendario.style.display === 'none' ? 'block' : 'none';
}
// Función para generar un informe detallado en PDF con todos los registros en el rango de fechas
function generarInformePorFecha() {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (!startDate || !endDate) {
        alert("Por favor, selecciona un rango de fechas válido.");
        return;
    }

    // Convertir las fechas de inicio y fin a objetos Date
    const startDateObj = new Date(startDate.split('/').reverse().join('-'));
    const endDateObj = new Date(endDate.split('/').reverse().join('-'));

    // Filtrar los registros dentro del rango de fechas
    const registrosEnRango = registrosFiltrados.filter(item => {
        const [fecha, hora] = item.fechaHora.split(' ');
        const [day, month, year] = fecha.split('/');
        const fechaRegistro = new Date(`${year}-${month}-${day}`);
        return fechaRegistro >= startDateObj && fechaRegistro <= endDateObj;
    });

    if (registrosEnRango.length === 0) {
        alert("No se encontraron registros en este rango de fechas.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const empresa = "Vivero Las Magnolias";
    const fechaCreacion = new Date().toLocaleDateString();

    // Título del informe
    doc.setFontSize(14);
    doc.text(`Informe de Historial de Cambios - ${empresa}`, 10, 10);
    doc.setFontSize(10);
    doc.text(`Fecha de Creación del Informe: ${fechaCreacion}`, 10, 20);
    doc.text(`Rango de Fechas: ${startDate} a ${endDate}`, 10, 30);
    doc.text("------------------------------", 10, 40);

    // Agregar cada registro al PDF
    let yOffset = 50; // Posición inicial en el eje Y
    registrosEnRango.forEach((registro, index) => {
        const contenidoRegistro = `
        Registro #${index + 1}
        ID: ${registro.id}
        Usuario: ${registro.usuario}
        Rol: ${registro.rol}
        Acción: ${registro.accion}
        Descripción: ${registro.descripcion}
        Fecha y Hora: ${registro.fechaHora}
        ------------------------------
        `;

        doc.text(contenidoRegistro, 10, yOffset);
        yOffset += 30; // Ajuste de espacio entre registros

        // Verifica si el contenido excede la página actual y crea una nueva si es necesario
        if (yOffset > 270) {
            doc.addPage();
            yOffset = 20;
        }
    });

    // Guardar el PDF con todos los registros en el rango
    doc.save(`historial_cambios_${startDate}_${endDate}.pdf`);
}
// Función para inicializar la página y cargar los datos
window.onload = () => {
    cargarRegistros(); // Cargar los registros al inicio
};
