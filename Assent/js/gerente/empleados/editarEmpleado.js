// Obtener datos del empleado desde el localStorage o JSON
function loadEmployeeData() {
    // Obtener el ID del empleado desde la URL
    const params = new URLSearchParams(window.location.search);
    const employeeId = params.get('id');

    // Cargar los datos desde el JSON
    fetch('/JSONs/empleado.json') // Cambia la ruta al archivo JSON real
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            return response.json();
        })
        .then(data => {
            // Buscar el empleado en el JSON
            const employee = data.find(e => e.id === Number(employeeId));
            if (employee) {
                // Rellenar el formulario con los datos del empleado
                document.getElementById('nombre').value = employee.nombre || '';
                document.getElementById('apellidos').value = employee.apellidos || '';
                document.getElementById('tipoIdentificacion').value = employee.tipoIdentificacion || '';
                document.getElementById('numeroIdentificacion').value = employee.numeroIdentificacion || '';
                document.getElementById('pais').value = employee.pais || '';
                document.getElementById('ciudad').value = employee.ciudad || '';
                document.getElementById('direccion').value = employee.direccion || '';
                document.getElementById('telefono').value = employee.telefono || '';
                document.getElementById('correo').value = employee.correo || '';
                document.getElementById('cargo').value = employee.cargo || '';
                document.getElementById('antecedentes').value = employee.antecedentes || '';
                document.getElementById('modifiedBy').innerText = employee.creadoPor || '';
                document.getElementById('creatorPosition').innerText = employee.rol || '';
                document.getElementById('modificationDate').innerText = employee.fechaCreacion || '';

                // Cargar la imagen del empleado
                document.getElementById('avatarEmpleado').src = employee.avatar || '/Assent/img/default-avatar.jpeg';
            } else {
                alert('Empleado no encontrado.');
            }
        })
        .catch(error => console.error('Error al cargar los datos del empleado:', error));
}

// Actualizar los datos del empleado
function updateEmployee(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const updatedEmployee = {
        id: new URLSearchParams(window.location.search).get('id'), // Obtener el ID del empleado
        nombre: document.getElementById('nombre').value,
        apellidos: document.getElementById('apellidos').value,
        tipoIdentificacion: document.getElementById('tipoIdentificacion').value,
        numeroIdentificacion: document.getElementById('numeroIdentificacion').value,
        pais: document.getElementById('pais').value,
        ciudad: document.getElementById('ciudad').value,
        direccion: document.getElementById('direccion').value,
        telefono: document.getElementById('telefono').value,
        correo: document.getElementById('correo').value,
        cargo: document.getElementById('cargo').value,
        antecedentes: document.getElementById('antecedentes').value,
        creadoPor: localStorage.getItem('usuario'), // Obtener el nombre del usuario actual
        fechaCreacion: new Date().toLocaleDateString(), // Actualizar la fecha de modificación
        avatar: document.getElementById('avatarEmpleado').src // Imagen actualizada
    };

    // Cargar los datos desde el JSON
    fetch('/JSONs/empleado.json') // Cambia la ruta al archivo JSON real
        .then(response => response.json())
        .then(data => {
            const employees = data.map(employee => 
                employee.id === Number(updatedEmployee.id) ? updatedEmployee : employee
            );

            // Guardar los datos actualizados en localStorage
            localStorage.setItem('empleados', JSON.stringify(employees));

            // Redirigir a la lista de empleados o mostrar un mensaje de éxito
            alert('Empleado actualizado con éxito.');
            window.location.href = '/Html/empleados/empleados.html'; // Redirigir a la lista de empleados
        })
        .catch(error => console.error('Error al guardar los datos del empleado:', error));
}

// Cargar la imagen del perfil
document.getElementById('profile-pic').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('avatarEmpleado').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Cargar los datos cuando se carga la página
window.onload = loadEmployeeData;
