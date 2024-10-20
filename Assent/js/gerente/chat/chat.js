// Supongamos que tienes el ID del proveedor almacenado en la URL o de otra manera
const providerId = 1729284403041; // Cambia esto según el proveedor seleccionado
let provider;

// Cargar datos del proveedor
document.addEventListener('DOMContentLoaded', () => {
    fetch('/JSONs/proveedores.json')
        .then(response => response.json())
        .then(data => {
            provider = data.find(p => p.id === providerId);
            if (provider) {
                document.getElementById('providerImage').src = provider.imagen;
                document.getElementById('providerName').innerText = provider.nombre;
            }
        })
        .catch(error => console.error('Error cargando el proveedor:', error));

    // Agregar el evento de envío
    document.getElementById('sendButton').addEventListener('click', sendMessage);
});

// Función para enviar mensaje
function sendMessage() {
    const fileInput = document.getElementById('fileInput');
    const messageInput = document.getElementById('messageInput');
    const file = fileInput.files[0];

    const messageContainer = document.getElementById('messageContainer');
    const message = document.createElement('div');
    message.classList.add('message');

    // Mensaje de texto
    if (messageInput.value.trim() !== '') {
        const textMessage = document.createElement('div');
        textMessage.innerText = messageInput.value.trim();
        message.appendChild(textMessage);
    }

    // Preview del archivo
    if (file) {
        const preview = document.createElement('div');
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.alt = 'Preview';
            img.style.width = '100px'; // Ajusta el tamaño según sea necesario
            preview.appendChild(img);
        } else if (file.type === 'application/pdf') {
            const pdfPreview = document.createElement('div');
            pdfPreview.innerText = 'Preview de PDF';
            preview.appendChild(pdfPreview);
        }
        message.appendChild(preview);
    }

    messageContainer.appendChild(message);
    
    // Desplazar hacia abajo para ver el nuevo mensaje
    messageContainer.scrollTop = messageContainer.scrollHeight;

    // Limpiar los inputs
    fileInput.value = '';
    messageInput.value = '';
}
