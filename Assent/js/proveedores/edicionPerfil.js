document.addEventListener('DOMContentLoaded', async function() {
    let updatedUser = {};

    // Cargar datos de localStorage
    const currentUserData = JSON.parse(localStorage.getItem('currentUser')); // Cambia 'userData' a 'currentUser'

    if (currentUserData) {
        // Si hay datos en localStorage, se cargan directamente
        document.getElementById('nombre').value = currentUserData.name || '';
        document.getElementById('apellidos').value = currentUserData.apellidos || '';
        document.getElementById('correo').value = currentUserData.email || '';
        document.getElementById('telefono').value = currentUserData.phone || '';
        document.getElementById('fecha-nacimiento').value = currentUserData.birthDate || '';
        document.getElementById('direccion').value = currentUserData.address || '';
        document.getElementById('ciudad').value = currentUserData.city || '';
        document.getElementById('pais').value = currentUserData.country || '';
        document.getElementById('tipo-id').value = currentUserData.idType || '';
        document.getElementById('numero-id').value = currentUserData.idNumber || '';
        document.getElementById('puesto').value = currentUserData.position || '';
        document.getElementById('avatar').src = currentUserData.avatar || 'default-avatar.png';
        document.getElementById('avatars').src = currentUserData.avatar || 'default-avatar.png'; // Imagen en el header

        // Inicializar updatedUser con los datos existentes
        updatedUser = { ...currentUserData }; // Usa currentUserData
    } else {
        // Si no hay datos en localStorage, cargar desde el JSON
        const email = JSON.parse(localStorage.getItem('userData')).email; // Obtener el email del localStorage

        // Cargar usuarios desde el JSON
        let users = [];
        try {
            const response = await fetch('/jsons/usuarios.json');
            users = await response.json();
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
            alert("No se pudo cargar la lista de usuarios.");
            return;
        }

        // Buscar el usuario en el JSON usando el email
        const user = users.find(user => user.email === email);

        if (user) {
            document.getElementById('nombre').value = user.name || '';
            document.getElementById('apellidos').value = user.lastName || '';
            document.getElementById('correo').value = user.email || '';
            document.getElementById('telefono').value = user.phone || '';
            document.getElementById('fecha-nacimiento').value = user.fechaNacimiento || '';
            document.getElementById('direccion').value = user.address || '';
            document.getElementById('ciudad').value = user.ciudad || '';
            document.getElementById('pais').value = user.pais || '';
            document.getElementById('tipo-id').value = user.tipoIndentificacion || '';
            document.getElementById('numero-id').value = user.nIdentificacion || '';
            document.getElementById('puesto').value = user.position || '';
            document.getElementById('avatar').src = user.avatar || 'default-avatar.png';
            document.getElementById('avatars').src = user.avatar || 'default-avatar.png'; // Imagen en el header

            // Inicializar updatedUser con los datos existentes
            updatedUser = { ...user };
        }
    }

    // Escuchar el formulario de actualización
    document.getElementById('editProfileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        updatedUser = {
            ...updatedUser,  // Mantener cualquier dato previamente actualizado (como la imagen)
            name: document.getElementById('nombre').value,
            lastName: document.getElementById('apellidos').value,
            email: document.getElementById('correo').value,
            phone: document.getElementById('telefono').value,
            birthDate: document.getElementById('fecha-nacimiento').value,
            address: document.getElementById('direccion').value,
            city: document.getElementById('ciudad').value,
            country: document.getElementById('pais').value,
            idType: document.getElementById('tipo-id').value,
            idNumber: document.getElementById('numero-id').value,
            position: document.getElementById('puesto').value, 
            avatar: document.getElementById('avatar').src
        };

        // Guardar el perfil actualizado en localStorage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        alert('Perfil actualizado con éxito');
        window.location.href = '/html/proveedor/Inicio.html'; // Redirigir de nuevo
    });

    // Manejar la carga de la imagen de perfil
    document.getElementById('profile-pic').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                // Actualizar ambas imágenes (header y formulario)
                document.getElementById('avatar').src = event.target.result;
                document.getElementById('avatars').src = event.target.result;

                // Actualizar la imagen en el objeto updatedUser
                updatedUser.avatar = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('cambiar-contrasena').addEventListener('click', function() {
        const currentPassword = document.getElementById('contrasena-actual').value;
        const newPassword = document.getElementById('nueva-contrasena').value;
        const confirmPassword = document.getElementById('confirmar-contrasena').value;

        if (currentPassword && newPassword && confirmPassword) {
            const hashedCurrentPassword = localStorage.getItem('hashedPassword');
            const encoder = new TextEncoder();

            crypto.subtle.digest('SHA-256', encoder.encode(currentPassword)).then(hash => {
                const hashArray = Array.from(new Uint8Array(hash));
                const hashedInputPassword = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');

                if (hashedInputPassword !== hashedCurrentPassword) {
                    alert('La contraseña actual es incorrecta.');
                    return;
                }

                if (newPassword !== confirmPassword) {
                    alert('Las nuevas contraseñas no coinciden.');
                    return;
                }

                crypto.subtle.digest('SHA-256', encoder.encode(newPassword)).then(newHash => {
                    const newHashArray = Array.from(new Uint8Array(newHash));
                    const hashedNewPassword = newHashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');

                    localStorage.setItem('hashedPassword', hashedNewPassword);
                    alert('Contraseña cambiada con éxito');
                    document.getElementById('contrasena-actual').value = '';
                    document.getElementById('nueva-contrasena').value = '';
                    document.getElementById('confirmar-contrasena').value = '';
                });
            });
        } else {
            alert('Por favor, completa todos los campos de contraseña.');
        }
    });
});
