// Lista de gerentes y proveedor en sesión
const gerenteEmail = "gerente@vivero.com"; // Gerente específico
const proveedorEmail = localStorage.getItem("sessionUserEmail"); // Proveedor en sesión

// Elementos HTML
const selectionContainer = document.getElementById("selectionContainer");
const chatContainer = document.getElementById("chatContainer");
const contactList = document.getElementById("contactList");
const providerName = document.getElementById("providerName");
const providerImage = document.getElementById("providerImage");

// Cargar lista de contactos (solo el gerente en este caso)
function loadContactList() {
    const gerente = { id: 1, name: "Gerente", email: gerenteEmail, image: "/Assent/img/profile/default-avatar.jpeg" };

    const contactDiv = document.createElement("div");
    contactDiv.classList.add("contact");
    contactDiv.innerHTML = `
        <img src="${gerente.image}" alt="${gerente.name}">
        <span>${gerente.name}</span>
    `;
    contactDiv.addEventListener("click", () => startChat(gerente));
    contactList.appendChild(contactDiv);
}

// Iniciar chat con el gerente
function startChat(gerente) {
    providerName.textContent = gerente.name;
    providerImage.src = gerente.image;

    // Ocultar la selección y mostrar el chat
    selectionContainer.style.display = "none";
    chatContainer.style.display = "block";

    // Cargar mensajes previos desde localStorage
    loadMessages();
}

// Cargar mensajes descifrados desde localStorage
function loadMessages() {
    const messageContainer = document.getElementById("messageContainer");
    messageContainer.innerHTML = ''; // Limpiar mensajes actuales

    const storedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    storedMessages.forEach(encryptedMessage => {
        const decryptedMessage = CryptoJS.AES.decrypt(encryptedMessage, "miClaveSecreta").toString(CryptoJS.enc.Utf8);
        addMessage(decryptedMessage, messageContainer);
    });
}

// Agregar mensaje a la vista
function addMessage(message, container) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.textContent = message;
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

// Enviar mensaje cifrado y guardarlo en localStorage
document.getElementById("sendButton").addEventListener("click", () => {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.trim();
    if (!message) return;

    // Cifrar y almacenar mensaje para el gerente en localStorage
    const encryptedMessage = CryptoJS.AES.encrypt(message, "miClaveSecreta").toString();
    const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    messages.push({ to: gerenteEmail, from: proveedorEmail, content: encryptedMessage });
    localStorage.setItem("chatMessages", JSON.stringify(messages));

    // Mostrar mensaje descifrado en el campo de mensajes
    addMessage(message, document.getElementById("messageContainer"));
    messageInput.value = "";

    // Llamar a la función de notificación
    triggerNotification();
});

// Función para notificar cuando llega un nuevo mensaje
function triggerNotification() {
    const notificationMenu = document.getElementById("notificationMenu");

    // Crear una nueva notificación
    const notificationDiv = document.createElement("div");
    notificationDiv.classList.add("notification-item");
    notificationDiv.textContent = "Nuevo mensaje recibido";
    notificationMenu.appendChild(notificationDiv);

    // Mostrar menú de notificaciones
    notificationMenu.style.display = "block";

    // Hacer que la notificación desaparezca automáticamente después de unos segundos
    setTimeout(() => {
        notificationDiv.remove();
    }, 5000); // Ajusta el tiempo según prefieras
}

// Salir del chat
document.getElementById("exitButton").addEventListener("click", () => {
    // Ocultar el chat y volver a la selección de gerentes
    chatContainer.style.display = "none";
    selectionContainer.style.display = "block";
});

// Cargar lista de gerentes al inicio
loadContactList();
