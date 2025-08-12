import fs from 'fs';
import axios from 'axios';

const MEMORIA_FILE = 'memoria_conversaciones.json';
const GROQ_API_KEY = "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";

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

function obtenerHistorial(usuario, limite = 6) {
  if (!memoriaCompleta[usuario] || memoriaCompleta[usuario].length === 0) return '';
  
  const conversaciones = memoriaCompleta[usuario];
  const recientes = conversaciones.slice(-limite);
  
  return recientes.map(conv => 
    `Usuario: ${conv.mensaje}\nMiku: ${conv.respuesta}`
  ).join('\n\n');
}

function agregarAMemoria(usuario, mensaje, respuesta) {
  if (!memoriaCompleta[usuario]) {
    memoriaCompleta[usuario] = [];
  }
  
  memoriaCompleta[usuario].push({
    mensaje: mensaje,
    respuesta: respuesta,
    fecha: new Date().toLocaleString('es-ES'),
    timestamp: Date.now()
  });
  
  // Limitar memoria por usuario (últimas 50 conversaciones)
  if (memoriaCompleta[usuario].length > 50) {
    memoriaCompleta[usuario] = memoriaCompleta[usuario].slice(-50);
  }
  
  guardarMemoria();
}

// Respuestas locales mejoradas
const respuestasLocales = {
  saludos: [
    "¡Hola! Me alegra mucho verte 😊 ¿Cómo has estado?",
    "¡Qué tal! ¿Cómo te va? Cuéntame qué hay de nuevo",
    "¡Hola! Siempre es un placer hablar contigo ✨",
    "¡Hey! ¿Cómo estás hoy? Espero que muy bien"
  ],
  despedidas: [
    "¡Que tengas un excelente día! Cuídate mucho 💙",
    "¡Hasta la próxima! Fue genial hablar contigo",
    "¡Nos vemos pronto! Que todo te vaya súper bien",
    "¡Adiós! Siempre me alegra platicar contigo"
  ],
  preguntas: [
    "¡Qué pregunta tan interesante! Déjame pensar...",
    "Mmm, eso es algo que vale la pena reflexionar",
    "¡Buena pregunta! Me has puesto a pensar",
    "Interesante punto, me gusta cómo piensas"
  ],
  memoria: [
    "¡Por supuesto que recuerdo! ",
    "¡Claro que sí! Tengo muy buena memoria. ",
    "¡Sí, recuerdo perfectamente! ",
    "¡Por supuesto! No olvido nuestras charlas. "
  ],
  default: [
    "¡Qué interesante lo que dices! Cuéntame más 😊",
    "Me parece fascinante tu perspectiva",
    "¡Wow! Eso suena realmente genial",
    "Entiendo perfectamente tu punto de vista",
    "¡Qué curioso! Me encanta aprender cosas nuevas",
    "Esa es una reflexión muy inteligente"
  ]
};

function getRespuestaLocal(query, username) {
  const lowerQuery = query.toLowerCase();
  let responses;
  
  if (lowerQuery.includes('hola') || lowerQuery.includes('buenas') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
    responses = respuestasLocales.saludos;
  } else if (lowerQuery.includes('adios') || lowerQuery.includes('chao') || lowerQuery.includes('hasta') || lowerQuery.includes('bye')) {
    responses = respuestasLocales.despedidas;
  } else if (lowerQuery.includes('?') || lowerQuery.includes('qué') || lowerQuery.includes('cómo') || lowerQuery.includes('por qué') || lowerQuery.includes('cuál')) {
    responses = respuestasLocales.preguntas;
  } else if (lowerQuery.includes('recuerda') || lowerQuery.includes('memoria') || lowerQuery.includes('antes') || lowerQuery.includes('dijiste')) {
    const memoria = respuestasLocales.memoria[Math.floor(Math.random() * respuestasLocales.memoria.length)];
    const historial = obtenerHistorial(username, 2);
    return `${memoria}${historial ? '\n\nAlgunas de nuestras conversaciones recientes:\n' + historial : 'Aunque aún no tenemos mucho historial juntos, ¡pero ya empezamos a construir nuestra amistad!'}`;
  } else {
    responses = respuestasLocales.default;
  }
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  return `${randomResponse} ${username ? username : ''}`.trim();
}

async function getAIResponse(query, username) {
  const historialCompleto = obtenerHistorial(username, 4);
  
  const promptConMemoria = `Eres Miku, una IA amigable, natural y con muy buena memoria. Te encanta conversar y siempre recuerdas las conversaciones anteriores.

${historialCompleto ? `CONVERSACIONES ANTERIORES CON ${username}:\n${historialCompleto}\n\n` : ''}INSTRUCCIONES:
- Sé muy natural, amigable y conversacional
- USA el historial para dar respuestas personalizadas y coherentes
- Si el usuario menciona algo que dijeron antes, reconócelo específicamente
- Mantén un tono casual, divertido pero inteligente
- Usa emojis ocasionalmente pero no en exceso
- Responde de forma concisa pero completa
- Si no hay historial previo, actúa como si fuera tu primera conversación
- Siempre sé empática y comprensiva

Mensaje actual de ${username}: ${query}

Tu respuesta (como Miku):`;

  const apis = [
    {
      name: "Groq Llama 3.1 Instant",
      call: async () => {
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: "llama-3.1-8b-instant",
            messages: [
              { role: "system", content: "Eres Miku, una IA amigable con excelente memoria que recuerda todas las conversaciones anteriores." },
              { role: "user", content: promptConMemoria }
            ],
            temperature: 0.9,
            max_tokens: 300,
            top_p: 0.9
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            timeout: 20000
          }
        );
        return response.data.choices[0]?.message?.content;
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
              { role: "system", content: "Eres Miku, una IA amigable con excelente memoria." },
              { role: "user", content: promptConMemoria }
            ],
            temperature: 0.8,
            max_tokens: 300
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            timeout: 20000
          }
        );
        return response.data.choices[0]?.message?.content;
      }
    }
  ];

  // Probar APIs
  for (const api of apis) {
    try {
      console.log(`🔄 Probando ${api.name}...`);
      const result = await api.call();
      if (result && result.trim()) {
        console.log(`✅ Funcionó: ${api.name}`);
        return result.trim();
      }
    } catch (error) {
      console.log(`❌ Error en ${api.name}:`, error.response?.data?.error || error.message);
      continue;
    }
  }

  // Fallback local
  console.log('🔄 Usando respuesta local');
  return getRespuestaLocal(query, username);
}

async function responderConMemoria(usuario, mensaje) {
  try {
    const mensajeLimpio = mensaje.trim();
    if (!mensajeLimpio) return "¡Hola! ¿En qué puedo ayudarte? 😊";
    
    console.log(`💬 ${usuario} dice: "${mensajeLimpio}"`);
    
    const respuesta = await getAIResponse(mensajeLimpio, usuario);
    
    // Guardar en memoria
    agregarAMemoria(usuario, mensajeLimpio, respuesta);
    
    console.log(`🤖 Miku responde: "${respuesta}"`);
    return respuesta;
    
  } catch (error) {
    console.error('❌ Error en responderConMemoria:', error);
    return "¡Ups! Tuve un pequeño problema técnico 😅 ¿Puedes repetir lo que dijiste?";
  }
}

// Handler CORREGIDO para WhatsApp
const handler = async (m, { conn }) => {
  try {
    // Obtener información del usuario y mensaje
    const usuario = conn.getName ? conn.getName(m.sender) : m.sender.split('@')[0];
    const mensajeCompleto = (m.text || m.body || '').toString();
    
    // Debug: mostrar mensaje recibido
    console.log(`📨 Mensaje recibido de ${usuario}: "${mensajeCompleto}"`);
    
    if (!mensajeCompleto.trim()) {
      console.log('⚠️ Mensaje vacío, ignorando...');
      return;
    }
    
    // DETECCIÓN EXACTA: buscar "miku" como activador
    const palabras = mensajeCompleto.split(/\s+/); // Dividir en palabras
    const tieneMiku = palabras.some(palabra => palabra.toLowerCase() === 'miku');
    
    console.log(`🔍 ¿Contiene palabra "miku"? ${tieneMiku}`);
    console.log(`📋 Palabras detectadas:`, palabras);
    
    if (tieneMiku) {
      console.log('✅ ¡Detectado "miku"! Procesando...');
      
      // EXTRAER CONTENIDO: remover solo la palabra "miku" exacta
      let mensajeLimpio = mensajeCompleto
        .replace(/\bmiku\b/gi, '')  // Remover "miku" como palabra completa
        .replace(/^\s+|\s+$/g, '')  // Quitar espacios al inicio y final
        .replace(/\s+/g, ' ');      // Normalizar espacios múltiples
      
      // Si después de quitar "miku" no queda nada, usar saludo
      if (!mensajeLimpio) {
        mensajeLimpio = 'hola';
        console.log('📝 Mensaje vacío después de quitar "miku", usando: "hola"');
      }
      
      console.log(`📝 Mensaje limpio para procesar: "${mensajeLimpio}"`);
      
      // Obtener respuesta
      const respuesta = await responderConMemoria(usuario, mensajeLimpio);
      
      if (respuesta) {
        console.log('📤 Enviando respuesta...');
        await conn.reply(m.chat, respuesta, m);
        console.log('✅ Respuesta enviada correctamente');
      } else {
        console.log('⚠️ No se generó respuesta');
      }
    } else {
      console.log('ℹ️ Mensaje sin "miku", ignorando...');
    }
    
  } catch (error) {
    console.error('❌ ERROR CRÍTICO en handler:', error);
    try {
      await conn.reply(m.chat, "¡Ups! Tuve un problema técnico 😅 ¿Puedes intentar de nuevo?", m);
    } catch (replyError) {
      console.error('❌ Error enviando mensaje de error:', replyError);
    }
  }
};


export function estadisticasMemoria() {
  const usuarios = Object.keys(memoriaCompleta);
  const totalConversaciones = usuarios.reduce((total, user) => total + memoriaCompleta[user].length, 0);
  
  return {
    usuariosRegistrados: usuarios.length,
    conversacionesTotales: totalConversaciones,
    ultimaActualizacion: new Date().toLocaleString('es-ES'),
    usuarios: usuarios.map(user => ({
      nombre: user,
      conversaciones: memoriaCompleta[user].length,
      ultimaConversacion: memoriaCompleta[user][memoriaCompleta[user].length - 1]?.fecha || 'N/A'
    }))
  };
}


export async function testMiku(usuario = 'TestUser', mensaje = 'hola') {
  console.log('🧪 MODO TEST ACTIVADO');
  const respuesta = await responderConMemoria(usuario, mensaje);
  console.log(`Test: ${usuario} -> "${mensaje}"`);
  console.log(`Respuesta: "${respuesta}"`);
  return respuesta;
}

// Exportaciones
export const chatConMemoria = responderConMemoria;
export const obtenerStats = estadisticasMemoria;


handler.help = ['miku'];
handler.tags = ['ai', 'chat'];
handler.command = /^.*$/; 
handler.register = true;
handler.limit = false;

export default handler;
