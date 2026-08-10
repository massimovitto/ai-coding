// suveia - Versión optimizada con API en la nube

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const statusBadge = document.getElementById('status-badge');

// ⚠️ AQUÍ PEGARÁS TU CLAVE API GRATUITA CUANDO LA TENGAS
const API_KEY = "PEGA_AQUÍ_TU_API_KEY"; 

let chatHistory = [
    { role: "user", parts: [{ text: "Eres suveia, un asistente personal de inteligencia artificial de alto nivel estilo JARVIS. Eres directo, lógico y muy útil en programación." }] }
];

// Estado inicial
statusBadge.textContent = "suveia Online (Cloud)";
statusBadge.style.backgroundColor = "#22c55e"; // Verde
userInput.disabled = false;
sendBtn.disabled = false;

function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    msgDiv.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    if (API_KEY === "PEGA_AQUÍ_TU_API_KEY") {
        addMessage("⚠️ Error: Falta configurar la API Key en el archivo app.js", "ai");
        return;
    }

    addMessage(text, 'user');
    userInput.value = '';
    userInput.disabled = true;
    sendBtn.disabled = true;

    // Guardar en historial local
    chatHistory.push({ role: "user", parts: [{ text: text }] });

    const aiMsgDiv = document.createElement('div');
    aiMsgDiv.classList.add('message', 'ai-message');
    aiMsgDiv.textContent = 'Pensando...';
    chatMessages.appendChild(aiMsgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        // Petición a la API de Gemini (rápida, gratuita y sin trabar el celular)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: chatHistory })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            aiMsgDiv.textContent = aiResponse;
            chatHistory.push({ role: "model", parts: [{ text: aiResponse }] });
        } else {
            aiMsgDiv.textContent = "Error: No se pudo obtener respuesta de los servidores.";
        }

    } catch (error) {
        console.error(error);
        aiMsgDiv.textContent = "Error de red al conectar con suveia.";
    }

    userInput.disabled = false;
    sendBtn.disabled = false;
    userInput.focus();
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
