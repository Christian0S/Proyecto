document.addEventListener("DOMContentLoaded", function() {
    cargarProveedoresDesdeJSON();
});

function cargarProveedoresDesdeJSON() {
    fetch('/jsons/proveedores.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem("proveedores", JSON.stringify(data));
            actualizarProgreso();
        })
        .catch(error => {
            console.error("Error al cargar el JSON:", error);
            alert("No se pudieron cargar los proveedores. Intenta de nuevo más tarde.");
        });
}

function actualizarProgreso() {
    const proveedores = JSON.parse(localStorage.getItem("proveedores")) || [];
    const promedioCalificaciones = calcularPromedio(proveedores, 'calificacion');
    const cumplimientoContratos = calcularProporción(proveedores, 'cantidadCalificaciones', 30);

    // Actualizar el texto del porcentaje de Proveedores
    document.getElementById("proveedores-percentage").innerText = `${promedioCalificaciones}%`;
    document.getElementById("grafica-proveedores").style.setProperty('--i', promedioCalificaciones);

    // Actualizar el texto del porcentaje de Contratos
    document.getElementById("contratos-percentage").innerText = `${cumplimientoContratos}%`;
    document.getElementById("grafica-contratos").style.setProperty('--i', cumplimientoContratos);
}


// Calcular proporción sobre un máximo específico para contratos
function calcularProporción(data, key, max) {
    const values = data.map(item => item[key] || 0);
    const promedio = values.length ? values.reduce((acc, val) => acc + val, 0) / values.length : 0;
    return Math.min((promedio / max) * 100, 100).toFixed(1);
}

// Calcular el promedio de calificaciones
function calcularPromedio(data, key) {
    const values = data.map(item => item[key] || 0);
    return values.length ? ((values.reduce((acc, val) => acc + val, 0) / values.length) * 10).toFixed(1) : 0;
}

// Calcular proporción sobre un máximo específico para contratos
function calcularProporción(data, key, max) {
    const values = data.map(item => item[key] || 0);
    const promedio = values.length ? values.reduce((acc, val) => acc + val, 0) / values.length : 0;
    return Math.min((promedio / max) * 100, 100).toFixed(1); // Limita el resultado a 100%
}

function mostrarProveedores(seccion) {
    const proveedores = JSON.parse(localStorage.getItem("proveedores")) || [];
    const proveedorDetalle = document.getElementById("detalle-proveedor");
    proveedorDetalle.innerHTML = ''; // Limpiar contenido

    let content = `<h3>Detalle de ${seccion}</h3><ul>`;

    // Filtrar proveedores según la sección
    const criterios = {
        mejoresCalificacion: (proveedor) => proveedor.calificacion >= 8,
        cumplimientoContratos: (proveedor) => proveedor.cantidadCalificaciones > 10,
        plazoEntrega: (proveedor) => proveedor.productos && proveedor.productos.includes("Abono para Césped"),
        tasaDefectos: (proveedor) => proveedor.calificacion < 5,
    };

    const proveedoresFiltrados = proveedores.filter(criterios[seccion] || (() => true));

    // Comprobar si hay proveedores filtrados
    if (proveedoresFiltrados.length === 0) {
        content += `<li>No hay proveedores que cumplan con los criterios para esta sección.</li>`;
    } else {
        proveedoresFiltrados.forEach(proveedor => {
            content += `
                <li>
                    <strong>Nombre:</strong> ${proveedor.nombre}<br>
                    <strong>Calificación:</strong> ${proveedor.calificacion.toFixed(1)}<br>
                    <strong>Productos:</strong> ${proveedor.productos ? proveedor.productos.join(", ") : 'N/A'}<br>
                    <img src="${proveedor.imagen}" alt="${proveedor.nombre}" style="width:50px;height:50px;">
                </li>
            `;
        });
    }

    content += '</ul>';
    proveedorDetalle.innerHTML = content;
}

