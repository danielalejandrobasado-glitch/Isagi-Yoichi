import fs from 'fs';
import axios from 'axios';

const MEMORIA_FILE = 'memoria_conversaciones.json';
const GROQ_API_KEY = "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";
const GEMINI_API_KEY = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"; // Reemplaza con tu clave real

let memoriaCompleta = {};
if (fs.existsSync(MEMORIA_FILE)) {
  try {
    memoriaCompleta = JSON.parse(fs.readFileSync(MEMORIA_FILE, 'utf8'));
  } catch (error) {
    memoriaCompleta = {};
  }
}

function guardarMemoria() {
  try {
    fs.writeFileSync(MEMORIA_FILE, JSON.stringify(memoriaCompleta, null, 2));
  } catch (error) {
    console.error('Error guardando memoria:', error);
  }
}

function obtenerHistorial(usuario, limite = 10) {
  if (!memoriaCompleta[usuario]) return '';
  
  const conversaciones = memoriaCompleta[usuario];
  const recientes = conversaciones.slice(-limite);
  
  return recientes.map(conv => 
    `[${conv.fecha}] Usuario: ${conv.mensaje}\nIA: ${conv.respuesta}`
  ).join('\n');
}

function agregarAMemoria(usuario, mensaje, respuesta) {
  if (!memoriaCompleta[usuario]) {
    memoriaCompleta[usuario] = [];
  }
  
  memoriaCompleta[usuario].push({
    mensaje: mensaje,
    respuesta: respuesta,
    fecha: new Date().toISOString(),
    timestamp: Date.now()
  });
  
  // Limitar memoria por usuario (últimas 100 conversaciones)
  if (memoriaCompleta[usuario].length > 100) {
    memoriaCompleta[usuario] = memoriaCompleta[usuario].slice(-100);
  }
  
  guardarMemoria();
}

// Respuestas locales para cuando las APIs fallen
const respuestasLocales = {
  saludos: [
    "¡Hola! Me alegra verte de nuevo. ¿En qué puedo ayudarte hoy?",
    "¡Qué tal! ¿Cómo has estado? Cuéntame qué hay de nuevo",
    "¡Hola! Siempre es un placer hablar contigo"
  ],
  despedidas: [
    "¡Que tengas un excelente día! Siempre recordaré nuestra conversación",
    "¡Hasta la próxima! Estaré aquí cuando quieras hablar",
    "¡Cuídate mucho! Espero verte pronto por aquí"
  ],
  memoria: [
    "Claro que recuerdo nuestras conversaciones anteriores. ",
    "Por supuesto, tengo presente lo que me has contado antes. ",
    "Sí, recuerdo perfectamente lo que hemos hablado. "
  ],
  default: [
    "Es interesante lo que dices, cuéntame más detalles",
    "Me parece fascinante tu perspectiva sobre eso",
    "¡Qué curioso! Me gustaría profundizar en el tema",
    "Entiendo tu punto de vista, es muy válido",
    "Esa es una reflexión muy interesante"
  ]
};

function getRespuestaLocal(query, username) {
  const lowerQuery = query.toLowerCase();
  let responses;
  
  if (lowerQuery.includes('hola') || lowerQuery.includes('buenas') || lowerQuery.includes('hi')) {
    responses = respuestasLocales.saludos;
  } else if (lowerQuery.includes('adios') || lowerQuery.includes('chao') || lowerQuery.includes('hasta luego')) {
    responses = respuestasLocales.despedidas;
  } else if (lowerQuery.includes('recuerda') || lowerQuery.includes('memoria') || lowerQuery.includes('antes')) {
    const memoria = respuestasLocales.memoria[Math.floor(Math.random() * respuestasLocales.memoria.length)];
    const historial = obtenerHistorial(username, 3);
    return `${memoria}${historial ? 'Algunas de nuestras conversaciones recientes:\n' + historial : 'Aunque aún no tenemos mucho historial juntos.'}`;
  } else {
    responses = respuestasLocales.default;
  }
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  return randomResponse;
}

async function getAIResponse(query, username) {
  // Obtener historial para contexto
  const historialCompleto = obtenerHistorial(username, 8);
  
  const promptConMemoria = `Eres una IA amigable y natural llamada Miku. Tienes una excelente memoria y recuerdas todas las conversaciones pasadas con cada usuario.

HISTORIAL DE CONVERSACIONES CON ${username}:
${historialCompleto}

INSTRUCCIONES:
- Sé natural, amigable y conversacional
- Usa el historial para dar respuestas más personalizadas y coherentes
- Si el usuario hace referencia a algo que dijeron antes, reconócelo
- Mantén un tono casual pero inteligente
- No uses demasiados emojis, solo ocasionalmente
- Responde de forma concisa pero completa
- Si no tienes historial previo, actúa como si fuera la primera conversación

Usuario: ${query}
IA:`;

  const apis = [
    {
      name: "Groq Llama 3.1",
      call: async () => {
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: "llama-3.1-8b-instant",
            messages: [
              { role: "system", content: promptConMemoria },
              { role: "user", content: query }
            ],
            temperature: 0.8,
            max_tokens: 400
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            timeout: 25000
          }
        );
        return response.data.choices[0]?.message?.content;
      }
    },
    {
      name: "Google Gemini",
      call: async () => {
        const response = await axios.post(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
          {
            contents: [{
              parts: [{ text: promptConMemoria }]
            }],
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 400
            }
          },
          {
            headers: { 
              'Content-Type': 'application/json',
              'x-goog-api-key': GEMINI_API_KEY
            },
            timeout: 25000
          }
        );
        return response.data.candidates[0]?.content?.parts[0]?.text;
      }
    },
    {
      name: "Groq Llama 4 Scout", 
      call: async () => {
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages: [
              { role: "system", content: promptConMemoria },
              { role: "user", content: query }
            ],
            temperature: 0.7,
            max_tokens: 400
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            timeout: 25000
          }
        );
        return response.data.choices[0]?.message?.content;
      }
    }
  ];

  // Probar APIs en orden
  for (const api of apis) {
    try {
      console.log(`Intentando con ${api.name}...`);
      const result = await api.call();
      if (result && result.trim()) {
        console.log(`✅ Éxito con ${api.name}`);
        return result.trim();
      }
    } catch (error) {
      console.log(`❌ Falló ${api.name}:`, error.message);
      continue;
    }
  }

  // Fallback local si todas las APIs fallan
  console.log('🔄 Usando respuesta local como fallback');
  return getRespuestaLocal(query, username);
}

async function responderConMemoria(usuario, mensaje) {
  try {
    // Limpiar el mensaje
    const mensajeLimpio = mensaje.trim();
    if (!mensajeLimpio) return "¡Hola! ¿En qué puedo ayudarte?";
    
    console.log(`💬 ${usuario}: ${mensajeLimpio}`);
    
    // Obtener respuesta de IA
    const respuesta = await getAIResponse(mensajeLimpio, usuario);
    
    // Guardar en memoria
    agregarAMemoria(usuario, mensajeLimpio, respuesta);
    
    console.log(`🤖 IA: ${respuesta}`);
    return respuesta;
    
  } catch (error) {
    console.error('Error en responderConMemoria:', error);
    return "Disculpa, tuve un pequeño problema. ¿Puedes repetir lo que dijiste?";
  }
}

// Handler para WhatsApp bots (compatible con tu estructura actual)
const handler = async (m, { conn }) => {
  try {
    const usuario = conn.getName ? conn.getName(m.sender) : m.sender.split('@')[0];
    const mensaje = m.text || m.body || '';
    
    if (!mensaje.trim()) return;
    
    // Detectar si el mensaje contiene "miku" para activar la IA
    const lowerMensaje = mensaje.toLowerCase();
    if (lowerMensaje.includes('miku')) {
      // Remover "miku" del mensaje para obtener solo el contenido
      const mensajeLimpio = mensaje.replace(/miku/gi, '').trim() || 'hola';
      
      const respuesta = await responderConMemoria(usuario, mensajeLimpio);
      
      if (respuesta) {
        await conn.reply(m.chat, respuesta, m);
      }
    }
    
  } catch (error) {
    console.error('Error en handler:', error);
    await conn.reply(m.chat, "Disculpa, tuve un problema técnico. ¿Puedes intentar de nuevo?", m);
  }
};

// Función para usar en otros contextos (no solo WhatsApp)
export const chatConMemoria = responderConMemoria;

// Función para obtener estadísticas de memoria
export function estadisticasMemoria() {
  const usuarios = Object.keys(memoriaCompleta);
  const totalConversaciones = usuarios.reduce((total, user) => total + memoriaCompleta[user].length, 0);
  
  return {
    usuariosRegistrados: usuarios.length,
    conversacionesTotales: totalConversaciones,
    usuarios: usuarios.map(user => ({
      nombre: user,
      conversaciones: memoriaCompleta[user].length,
      ultimaConversacion: memoriaCompleta[user][memoriaCompleta[user].length - 1]?.fecha
    }))
  };
}

// Función para borrar memoria de un usuario específico
export function borrarMemoriaUsuario(usuario) {
  if (memoriaCompleta[usuario]) {
    delete memoriaCompleta[usuario];
    guardarMemoria();
    return true;
  }
  return false;
}

handler.help = ['ia-memoria'];
handler.tags = ['ai'];
handler.register = true;

export default handler;
