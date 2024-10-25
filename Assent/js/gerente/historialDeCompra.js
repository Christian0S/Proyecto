// Datos quemados (hardcoded)
const registros = [
    {
        id: 1,
        usuario: "Vanessa",
        rol: "Administrador",
        accion: "Modificación de Proveedor",
        descripcion: "Cambió la dirección del proveedor XYZ.",
        fechaHora: "20/10/2024 09:00"
    },
    {
        id: 2,
        usuario: "Jose",
        rol: "Empleado Compras",
        accion: "Creación de Orden de Compra",
        descripcion: "Creó la orden de compra número 12345.",
        fechaHora: "19/10/2024 14:35"
    },
    {
        id: 3,
        usuario: "Bob",
        rol: "Proveedor",
        accion: "Actualización de información",
        descripcion: "Actualizó la información de contacto.",
        fechaHora: "18/10/2024 11:20"
    }
];

// Función para cargar los registros en la tabla
function cargarRegistros() {
    const tabla = document.getElementById("registroTabla");
    tabla.innerHTML = ""; // Limpiar el contenido de la tabla antes de cargar

    registros.forEach(registro => {
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
        boton.textContent = "📚";
        boton.onclick = () => generateReport(registro.id);
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
}

// Función para generar un informe
function generateReport(id) {
    alert(`Generando informe para el registro con ID: ${id}`);
}

// Función para filtrar por periodo de tiempo (ejemplo básico)
function filterByDate() {
    let startDate = prompt("Ingresa la fecha de inicio (dd/mm/yyyy):");
    let endDate = prompt("Ingresa la fecha de fin (dd/mm/yyyy):");
    alert(`Filtrando por fechas: ${startDate} - ${endDate}`);
}

// Función para inicializar la página y cargar los datos
window.onload = () => {
    cargarRegistros();
};

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
        rows[i].style.display = match ? "" : "none";
    }
});
