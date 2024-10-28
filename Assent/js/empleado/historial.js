// Cargar los registros desde un archivo JSON
async function cargarRegistros() {
    try {
        const response = await fetch('/jsons/historialDecambios.json'); // Asegúrate de que la ruta sea correcta
        if (!response.ok) {
            throw new Error('Error al cargar los registros');
        }
        const registros = await response.json();
        const tabla = document.getElementById("registroTabla");
        tabla.innerHTML = ""; // Limpiar el contenido de la tabla antes de cargar

        // Filtrar y cargar solo registros de empleados
        registros.forEach(registro => {
            if (registro.rol === 'Empleado') { // Cambia 'Empleado' por el rol que deseas filtrar
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
            }
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al cargar los registros.');
    }
}

// Función para generar un informe detallado en PDF
function generateReport(registro) {
    const { jsPDF } = window.jspdf; // Acceder a jsPDF
    const doc = new jsPDF();

    const empresa = "Vivero Las Magnolias"; // Asigna el nombre de la empresa
    const fechaCreacion = new Date().toLocaleDateString(); // Asigna la fecha de creación

    // Formato del contenido
    const contenido = `
        Informe de Actividad
        -----------------------
        Empresa: ${empresa}
        Fecha de Creación: ${fechaCreacion}
        ID: ${registro.id}
        Usuario: ${registro.usuario}
        Rol: ${registro.rol}
        Acción: ${registro.accion}
        Descripción: ${registro.descripcion}
        Fecha y Hora: ${registro.fechaHora}
        
        Descripción Detallada:
        Se ha realizado una acción registrada por el usuario ${registro.usuario} 
        con rol de ${registro.rol}. La acción consiste en ${registro.accion} 
        que tuvo lugar el ${registro.fechaHora}. 
    `;

    // Añadir contenido al PDF
    doc.setFontSize(12);
    doc.text(contenido, 10, 10); // Ajusta la posición (10, 10) según sea necesario
    
    // Generar el PDF
    doc.save(`informe_actividad_${registro.id}.pdf`);
}

// Función para inicializar la página y cargar los datos
window.onload = () => {
    cargarRegistros(); // Cargar los registros al inicio
};

// Filtrar la tabla por búsqueda
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", function() {
    let filter = searchInput.value.toLowerCase();
    let rows = document.getElementById("registroTabla").getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) { // Comenzar desde 0 para incluir el encabezado
        let cells = rows[i].getElementsByTagName("td");
        let match = false;
        for (let j = 0; j < cells.length - 1; j++) { // Última celda es de acciones
            if (cells[j].textContent.toLowerCase().indexOf(filter) > -1) {
                match = true;
                break;
            }
        }
        rows[i].style.display = match ? "" : "none"; // Mostrar o esconder fila
    }
});
