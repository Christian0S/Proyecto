// Cargar datos del proveedor desde localStorage
document.addEventListener('DOMContentLoaded', () => {
    const providerData = JSON.parse(localStorage.getItem('selectedProvider'));
    if (providerData) {
        document.getElementById('providerImage').src = providerData.imagen;
        document.getElementById('providerName').innerText = providerData.nombre;
    } else {
        console.error('No se encontró información del proveedor en localStorage');
    }

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
        textMessage.classList.add('text-message');
        textMessage.innerText = messageInput.value.trim();
        message.appendChild(textMessage);
    }

    // Preview del archivo
    if (file) {
        const preview = document.createElement('div');
        preview.classList.add('file-preview');
        
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

}
