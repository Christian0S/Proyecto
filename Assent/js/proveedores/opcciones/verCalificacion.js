// Función para convertir la calificación numérica a su descripción
function calificar(score) {
    let descripcion = "";
    if (score >= 9) descripcion = "Excelente";
    else if (score >= 7) descripcion = "Aceptable";
    else descripcion = "Insuficiente";
    return descripcion;
}

// Función para cargar los datos desde los archivos JSON
async function cargarDatos() {
    try {
        const comprasResponse = await fetch('/jsons/compras.json'); // Ruta del archivo JSON de compras
        const evaluacionesResponse = await fetch('/jsons/evaluaciones.json'); // Ruta del archivo JSON de evaluaciones

        const compras = await comprasResponse.json(); // Parsear el JSON de compras
        const evaluaciones = await evaluacionesResponse.json(); // Parsear el JSON de evaluaciones
        
        return { compras, evaluaciones };
    } catch (error) {
        console.error("Error al cargar los datos: ", error);
        return { compras: [], evaluaciones: [] }; // Devuelve arrays vacíos en caso de error
    }
}

// Función para obtener el parámetro 'id' de la URL
function obtenerIdDeUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Función para cargar y mostrar la información de la compra por ID
async function cargarInformacionPorId(compraId) {
    const { compras, evaluaciones } = await cargarDatos();
    
    // Filtramos las compras con estado "Calificado" y buscamos la compra por ID
    const compra = compras.find(compra => compra.id === compraId && compra.estado === "Calificado");

    if (compra) {
        // Mostrar la información de la compra
        document.getElementById('nombreCompra').innerText = compra.nombrePedido;
        document.getElementById('proveedor').innerText = compra.proveedor;
        document.getElementById('fechaCreada').innerText = compra.fechaCreacion;
        document.getElementById('valor').innerText = compra.valorTotal;
        document.getElementById('estado').innerText = compra.estado;

        // Mostrar los productos de la compra
        const productList = document.getElementById('productList');
        productList.innerHTML = ''; // Limpiar contenido previo
        compra.productos.forEach((producto, index) => {
            // Buscar la evaluación correspondiente al producto
            const evaluacion = evaluaciones.find(eval => eval.idCompra === compra.id && eval.producto.index === index);

            const row = document.createElement('tr');
            
            // Verificamos si la evaluación existe antes de acceder a sus propiedades
            if (evaluacion) {
                row.innerHTML = `
                    <td>${producto.nombre}</td>
                    <td>${producto.cantidad}</td>
                    <td>${producto.valorUnitario}</td>
                    <td>${evaluacion.producto.calificacion.calidad}</td>
                    <td>${evaluacion.producto.calificacion.precio}</td>
                    <td>${evaluacion.producto.calificacion.entrega}</td>
                    <td>${evaluacion.producto.calificacion.puntualidad}</td>
                `;
            } else {
                row.innerHTML = `
                    <td>${producto.nombre}</td>
                    <td>${producto.cantidad}</td>
                    <td>${producto.valorUnitario}</td>
                    <td colspan="4">Sin evaluación disponible</td>
                `;
            }
            productList.appendChild(row);
        });

        // Calificación final promedio
        let totalCalificacion = 0;
        let totalProductos = compra.productos.length;

        compra.productos.forEach((producto, index) => {
            const evaluacion = evaluaciones.find(eval => eval.idCompra === compra.id && eval.producto.index === index);
            if (evaluacion) {
                const promedio = (evaluacion.producto.calificacion.calidad + evaluacion.producto.calificacion.precio + evaluacion.producto.calificacion.entrega + evaluacion.producto.calificacion.puntualidad) / 4;
                totalCalificacion += promedio;
            }
        });

        const resultadoFinal = totalCalificacion / totalProductos;
        let resultadoTexto = "";
        if (resultadoFinal >= 9) {
            resultadoTexto = "Excelente";
        } else if (resultadoFinal >= 7) {
            resultadoTexto = "Aceptable";
        } else {
            resultadoTexto = "Insuficiente";
        }

        // Mostrar el informe completo de calificación con la nueva estructura
        const entregaDesc = calificar(evaluaciones[0]?.producto?.calificacion?.entrega ?? 0);
        const precioDesc = calificar(evaluaciones[0]?.producto?.calificacion?.precio ?? 0);
        const calidadDesc = calificar(evaluaciones[0]?.producto?.calificacion?.calidad ?? 0);

        document.getElementById('calificacionCompleta').innerHTML = `
            <p><strong>Puntualidad en las Entregas:</strong> ${entregaDesc}. La puntualidad en las entregas es evaluada en función del porcentaje de entregas realizadas a tiempo, con una calificación de ${evaluaciones[0]?.producto?.calificacion?.entrega ?? 0} sobre 10.</p>
            <p><strong>Costos:</strong> ${precioDesc}. Los costos fueron evaluados en función de si se ajustaron al presupuesto o al precio de mercado, con una calificación de ${evaluaciones[0]?.producto?.calificacion?.precio ?? 0} sobre 10.</p>
            <p><strong>Calidad del Producto:</strong> ${calidadDesc}. La calidad se evaluó en función del porcentaje de productos defectuosos por lote, con una calificación de ${evaluaciones[0]?.producto?.calificacion?.calidad ?? 0} sobre 10.</p>
            <p><strong>Desempeño General:</strong>. Este desempeño se calcula como el promedio ponderado de las métricas anteriores, con una calificación de ${resultadoFinal.toFixed(2)} sobre 10, lo que resulta en una calificación global de <strong>${resultadoTexto}</strong>.</p>
        `;
        
        // Enviar mensaje automático al gerente
        enviarMensajeGerente(compra, evaluaciones[0], resultadoFinal); // Pasamos los parámetros correctos
    } else {
        console.log("Compra no encontrada o no calificada.");
    }
}


// Al cargar la página, obtenemos el ID de la URL y mostramos la información
window.onload = function() {
    const compraId = obtenerIdDeUrl(); // Obtener el ID de la URL
    if (compraId) {
        cargarInformacionPorId(parseInt(compraId)); // Llamamos a la función pasando el ID de la compra
    } else {
        console.log("ID de compra no encontrado en la URL.");
    }
};

// Función para enviar un mensaje al gerente con datos importantes de la calificación
function enviarMensajeGerente(compra, evaluacion, resultadoFinal) {
    const mensajeGerente = `
        [Notificación Automática] Evaluación de Compra:
        - Compra: ${compra.nombreCompra}
        - Proveedor: ${compra.proveedor}
        - Desempeño General: ${resultadoFinal.toFixed(2)}
        - Comentario: ${evaluacion?.descripcion ?? "Sin comentario"}
    `;

    const messagesContainer = document.getElementById('messages');
    const gerenteMessage = document.createElement('p');
    gerenteMessage.innerText = `Mensaje al Gerente: ${mensajeGerente}`;
    messagesContainer.appendChild(gerenteMessage);
}

// Función para volver a la página anterior
function volver() {
    window.location.href = '/html/proveedor/inicio.html';
}


// Función para abrir el chat
function abrirChat() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.style.display = 'block';
    document.getElementById('btnMenssage').style.display = 'none';
}

// Función para cerrar el chat
function cerrarChat() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.style.display = 'none';
    document.getElementById('btnMenssage').style.display = 'block';
}

// Función para enviar un mensaje en el chat
function enviarMensaje() {
    const message = document.getElementById('userMessage').value;
    if (message.trim() !== '') {
        const messagesContainer = document.getElementById('messages');
        const newMessage = document.createElement('p');
        newMessage.innerText = `Empleado: ${message}`;
        messagesContainer.appendChild(newMessage);

        // Limpiar el campo de entrada
        document.getElementById('userMessage').value = '';
    }
}

