document.addEventListener('DOMContentLoaded', function() {
    // Función para obtener datos del usuario desde localStorage
    function getUserData() {
        const userData = JSON.parse(localStorage.getItem('userData')); // O usa sessionStorage si es necesario

        if (userData) {
            return {
                nombre: userData.nombre || 'Usuario', // Nombre por defecto
                rol: userData.rol || 'Rol desconocido' // Rol por defecto
            };
        } else {
            return {
                nombre: 'Usuario', // Nombre por defecto si no hay datos
                rol: 'Rol desconocido' // Rol por defecto si no hay datos
            };
        }
    }

    // Función para cargar los datos de creación al cargar la página
    function loadCreationInfo() {
        const userData = getUserData(); // Obtener datos del usuario

        // Mostrar el nombre y rol del usuario
        document.getElementById('modifiedBy').textContent = userData.nombre;
        document.getElementById('creatorPosition').textContent = userData.rol;
        document.getElementById('modificationDate').textContent = new Date().toLocaleDateString(); // Mostrar la fecha actual
    }

    // Ejecutar la función al cargar la página
    loadCreationInfo();

    // Lógica para cargar una imagen de perfil para el empleado
    const profilePicInput = document.getElementById('profile-pic');
    const avatarDisplay = document.getElementById('avatarEmpleado');

    profilePicInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                avatarDisplay.src = e.target.result; // Mostrar la imagen seleccionada
            };
            reader.readAsDataURL(file);
        }
    });

    // Lógica para crear un nuevo empleado
    document.getElementById('employeeForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir el envío del formulario

        const nombre = document.getElementById('nombre').value;
        const apellidos = document.getElementById('apellidos').value;
        const tipoIdentificacion = document.getElementById('tipoIdentificacion').value;
        const numeroIdentificacion = document.getElementById('numeroIdentificacion').value;
        const pais = document.getElementById('pais').value;
        const ciudad = document.getElementById('ciudad').value;
        const direccion = document.getElementById('direccion').value;
        const telefono = document.getElementById('telefono').value;
        const correo = document.getElementById('correo').value;
        const cargo = document.getElementById('cargo').value;
        const antecedentes = document.getElementById('antecedentes').value;

        // Lógica para manejar la carga de la hoja de vida
        const documentosInput = document.getElementById('documentos');
        const documentos = [];
        for (let i = 0; i < documentosInput.files.length; i++) {
            documentos.push(documentosInput.files[i].name); // Solo guardamos los nombres de los archivos
        }

        if (nombre && apellidos && numeroIdentificacion && pais && ciudad && correo && cargo) {
            const empleados = JSON.parse(localStorage.getItem('empleados')) || [];
            const nuevoEmpleado = {
                id: empleados.length + 1, // Generar ID
                nombre,
                apellidos,
                tipoIdentificacion,
                numeroIdentificacion,
                pais,
                ciudad,
                direccion,
                telefono,
                correo,
                cargo,
                antecedentes,
                documentos, // Guardar los nombres de los documentos
                creadoPor: getUserData().nombre, // Obtener nombre del creador desde los datos de usuario
                rol: getUserData().rol, // Obtener rol del creador desde los datos de usuario
                fechaCreacion: new Date().toLocaleDateString(), // Guardar la fecha actual
                avatar: avatarDisplay.src // Guardar la imagen del perfil si se ha cargado
            };

            empleados.push(nuevoEmpleado);
            localStorage.setItem('empleados', JSON.stringify(empleados));
            alert('Empleado creado con éxito.');
            window.location.href = 'empleados.html'; // Redirigir a la lista de empleados
        } else {
            alert('Por favor, complete todos los campos obligatorios.');
        }
    });
});
