import { CreateMLCEngine } from "https://esm.run/@mlc-ai/web-llm";

// 1. Conectar el código con los elementos visuales de tu HTML
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const statusBadge = document.getElementById('status-badge');

// 2. Elegir el modelo (el "cerebro"). Usaremos Llama-3, que es muy potente y ligero.

const selectedModel = "Llama-3-8B-Instruct-q4f32_1-MLC"; // ORIGINAL
 

let engine; // Aquí vivirá el motor de nuestra IA
let chatHistory = [
    // Aquí le damos su "personalidad" estilo JARVIS
    { role: "system", content: "Eres suveia, un asistente personal de inteligencia artificial de alto nivel. Eres directo, lógico, muy útil y apoyas en tareas de programación y organización." }
];

// 3. Función para despertar a suveia
async function initAI() {
    try {
        statusBadge.textContent = "Descargando pesos y cargando IA...";
        statusBadge.style.backgroundColor = "#eab308"; // Amarillo
        
        // Iniciamos el motor. Esto guardará los pesos en la memoria del navegador.
        engine = await CreateMLCEngine(
            selectedModel,
            { initProgressCallback: (progress) => {
                // Actualiza el porcentaje de carga en la pantalla
                statusBadge.textContent = `Cargando: ${Math.round(progress.progress * 100)}%`;
            }}
        );

        statusBadge.textContent = "suveia Online";
        statusBadge.style.backgroundColor = "#22c55e"; // Verde
        
        // Desbloquear la caja de texto
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();

        // Borrar mensaje inicial y dar la bienvenida
        chatMessages.innerHTML = '';
        addMessage("¡Sistemas en línea! Los parámetros neuronales están listos. ¿En qué te ayudo el día de hoy?", "ai");

    } catch (error) {
        console.error("Error al cargar la IA:", error);
        statusBadge.textContent = "Error de conexión";
        statusBadge.style.backgroundColor = "#ef4444"; // Rojo
    }
}

// 4. Función para dibujar los mensajes en la pantalla
function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    msgDiv.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    
    // Hacer scroll automático hacia abajo
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 5. Función para que suveia procese lo que le escribes
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return; // Si está vacío, no hacer nada

    // Dibujar el mensaje del usuario y bloquear la caja
    addMessage(text, 'user');
    userInput.value = '';
    userInput.disabled = true;
    sendBtn.disabled = true;

    // Agregar lo que dijiste a la memoria de la conversación
    chatHistory.push({ role: "user", content: text });

    // Poner un mensaje de "Pensando..." temporal
    const aiMsgDiv = document.createElement('div');
    aiMsgDiv.classList.add('message', 'ai-message');
    aiMsgDiv.textContent = 'Procesando...';
    chatMessages.appendChild(aiMsgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        // Pedirle a la IA que genere la respuesta
        const reply = await engine.chat.completions.create({
            messages: chatHistory
        });

        const aiResponse = reply.choices[0].message.content;
        
        // Mostrar la respuesta final
        aiMsgDiv.textContent = aiResponse;
        
        // Guardar la respuesta de suveia en la memoria
        chatHistory.push({ role: "assistant", content: aiResponse });
    } catch (error) {
        console.error(error);
        aiMsgDiv.textContent = "Error en los sistemas al procesar la solicitud.";
    }

    // Desbloquear la caja de texto para otra pregunta
    userInput.disabled = false;
    sendBtn.disabled = false;
    userInput.focus();
}

// 6. Escuchar cuando presionas Enter o das clic en Enviar
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// ¡Encender!
initAI();
 