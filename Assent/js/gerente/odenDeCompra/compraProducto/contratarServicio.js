const formContainer = document.getElementById('formContainer');
const addServiceBtn = document.getElementById('addServiceBtn');
const submitBtn = document.getElementById('submitBtn'); // Asegúrate de tener este botón en tu HTML
let serviceCounter = 0; // Contador para identificar cada servicio

// Función para agregar una nueva tarjeta de servicio
function addServiceForm() {
    serviceCounter++; // Incrementar el contador al agregar un nuevo servicio

    // Crear una nueva tarjeta
    const card = document.createElement('div');
    card.className = 'product-card';

    // Contenido de la tarjeta, utilizando los campos que proporcionaste
    card.innerHTML = `
        <div class="form-group">
            <label for="serviceType_${serviceCounter}">Tipo de Servicio:</label>
            <select id="serviceType_${serviceCounter}">
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Asesoría">Asesoría</option>
                <option value="Arreglos">Arreglos</option>
                <option value="Construcción">Construcción</option>
            </select>
        </div>
        <div class="form-group">
            <label for="serviceName_${serviceCounter}">Nombre del Servicio:</label>
            <input type="text" id="serviceName_${serviceCounter}" placeholder="Ej. Servicio de Jardinería">
        </div>
        <div class="form-group">
            <label for="serviceContractor_${serviceCounter}">Contratista:</label>
            <select id="serviceContractor_${serviceCounter}">
                <option value="Contratista A">Contratista A</option>
                <option value="Contratista B">Contratista B</option>
                <option value="Contratista C">Contratista C</option>
            </select>
        </div>
        <div class="form-group">
            <label for="serviceDescription_${serviceCounter}">Descripción:</label>
            <textarea id="serviceDescription_${serviceCounter}" rows="3" placeholder="Descripción del servicio..."></textarea>
        </div>
        <button type="button" class="delete-btn" onclick="removeServiceForm(this)">🗑️</button>
    `;

    // Añadir la tarjeta al contenedor
    formContainer.appendChild(card);
}

// Evento para añadir una nueva tarjeta de servicio
addServiceBtn.addEventListener('click', addServiceForm);

// Función para eliminar tarjeta
function removeServiceForm(button) {
    const card = button.closest('.product-card');
    formContainer.removeChild(card);
}

// Evento del botón de enviar
submitBtn.addEventListener('click', () => {
    // Aquí puedes agregar la lógica para enviar los datos
    alert('Datos de servicios enviados');
});

// Llamar a la función para añadir una tarjeta de servicio al cargar la página
window.onload = function() {
    addServiceForm(); // Agrega una tarjeta de servicio al iniciar
};
