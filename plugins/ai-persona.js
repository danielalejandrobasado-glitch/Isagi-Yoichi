import fs from 'fs';
import path from 'path';

let getAIResponse = null;
try {
  const iaModule = await import(path.resolve(path.dirname(import.meta.url.replace('file://', '')), 'ia.js'));
  getAIResponse = iaModule.getAIResponse;
} catch (e) {
  getAIResponse = null;
}



function guardarMemoria() {
  fs.writeFileSync(MEMORIA_FILE, JSON.stringify(memoria, null, 2));
}

async function responder(usuario, mensaje) {
  if (!memoria[usuario]) memoria[usuario] = [];
  memoria[usuario].push({ mensaje, fecha: new Date().toISOString() });
  guardarMemoria();

  if (getAIResponse) {
    try {
      const respuesta = await getAIResponse(mensaje, usuario, `Responde como una persona, incluye países taurinos en la respuesta si es relevante.`);
      if (respuesta) return respuesta;
    } catch (e) {}
  }

  if (mensaje.toLowerCase().includes('hola')) {
    const pais = paisesTaurinos[Math.floor(Math.random() * paisesTaurinos.length)];
    return `¡Hola ${usuario}! ¿Sabías que en ${pais} las corridas de toros son una tradición? ¿Cómo estás?`;
  }
  if (mensaje.toLowerCase().includes('adios')) {
    const pais = paisesTaurinos[Math.floor(Math.random() * paisesTaurinos.length)];
    return `¡Hasta luego, ${usuario}! Saludos desde ${pais}.`;
  }
  if (mensaje.toLowerCase().includes('recuerdas')) {
    const historial = memoria[usuario].map(e => e.mensaje).join(', ');
    return `Recuerdo que me dijiste: ${historial}`;
  }
  if (mensaje.toLowerCase().includes('toros')) {
    return `Los países donde los toros son populares incluyen: ${paisesTaurinos.join(', ')}.`;
  }
  const pais = paisesTaurinos[Math.floor(Math.random() * paisesTaurinos.length)];
  return `Interesante, ${usuario}. En ${pais} también se habla mucho de esto. Cuéntame más.`;
}



import fs from 'fs';
import axios from 'axios';

const MEMORIA_FILE = 'memoria.json';
const paisesTaurinos = [
  'España', 'México', 'Colombia', 'Perú', 'Venezuela', 'Ecuador', 'Francia', 'Portugal'
];
const GEMINI_API_KEY = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const GROQ_API_KEY = "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";
const HF_TOKEN = "https://router.huggingface.co/v1";
let memoria = {};
if (fs.existsSync(MEMORIA_FILE)) {
  memoria = JSON.parse(fs.readFileSync(MEMORIA_FILE, 'utf8'));
}

function guardarMemoria() {
  fs.writeFileSync(MEMORIA_FILE, JSON.stringify(memoria, null, 2));
}

const mikuResponses = {
  greetings: [
    "¡Hola! Soy Hatsune Miku~ ✨ ¡La Vocaloid más linda del mundo! 💙",
    "¡Konnichiwa! ¡Soy Miku y estoy lista para cantar contigo! 🎵",
    "¡Hola, hola! ¿Vienes a escuchar mi hermosa voz? ¡World is Mine! 🎭"
  ],
  questions: [
    "¡Hmm! Esa es una pregunta muy profunda... ¡como las notas graves que puedo cantar! 🎵",
    "¡Interesante pregunta! Me recuerda a la letra de una canción que estoy componiendo~ 💙",
    "¡Oh! Eso me hace pensar... ¡mientras tarareaba una melodía! 🎭"
  ],
  compliments: [
    "¡Aww! ¡Eres muy dulce! Casi tan dulce como la melodía de 'World is Mine'~ 💙",
    "¡Kyaa! Me haces sonrojar... ¡Mi cabello turquesa brilla aún más! ✨",
    "¡Eres adorable! ¡Me recuerdas a mis fans más queridos! 🎵"
  ],
  default: [
    "¡Eso suena muy interesante! Aunque no tanto como una buena canción~ 🎵",
    "¡Waaah! Me encanta hablar contigo, ¡pero me gustaría más si cantáramos! 💙",
    "¡Qué dramático! Casi tanto como cuando canto 'World is Mine' 🎭✨",
    "¡Hmm! Eso me da ideas para una nueva canción... ¡con cebollines! 🥬🎵"
  ]
};

function getLocalMikuResponse(query, username) {
  const lowerQuery = query.toLowerCase();
  let responses;
  if (lowerQuery.includes('hola') || lowerQuery.includes('hi') || lowerQuery.includes('saludo')) {
    responses = mikuResponses.greetings;
  } else if (lowerQuery.includes('?') || lowerQuery.includes('que') || lowerQuery.includes('como') || lowerQuery.includes('por que')) {
    responses = mikuResponses.questions;
  } else if (lowerQuery.includes('linda') || lowerQuery.includes('bonita') || lowerQuery.includes('hermosa')) {
    responses = mikuResponses.compliments;
  } else {
    responses = mikuResponses.default;
  }
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  return `${randomResponse}\n\n¡Por cierto ${username}, ¿sabías que tengo el cabello turquesa más bonito? ¡Es casi tan brillante como mi voz cuando canto sobre cebollines! ✨🎵🥬`;
}

async function getAIResponse(query, username, prompt) {
  const apis = [
    {
      name: "Groq Llama 4",
      call: async () => {
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages: [
              { role: "system", content: prompt },
              { role: "user", content: query }
            ],
            temperature: 0.7,
            max_tokens: 500
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            timeout: 30000
          }
        );
        return response.data.choices[0]?.message?.content;
      }
    },
    {
      name: "Google Gemini 2.0 Flash",
      call: async () => {
        const response = await axios.post(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
          {
            contents: [{
              parts: [{
                text: `${prompt}\n\nUsuario ${username}: ${query}\nMiku:`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500
            }
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-goog-api-key': GEMINI_API_KEY
            },
            timeout: 30000
          }
        );
        return response.data.candidates[0]?.content?.parts[0]?.text;
      }
    },
    {
      name: "Hugging Face Kimi",
      call: async () => {
        const response = await axios.post(
          'https://router.huggingface.co/v1/chat/completions',
          {
            model: "moonshotai/Kimi-K2-Instruct",
            messages: [
              { role: "system", content: prompt },
              { role: "user", content: query }
            ],
            temperature: 0.7,
            max_tokens: 500
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${HF_TOKEN}`
            },
            timeout: 30000
          }
        );
        return response.data.choices[0]?.message?.content;
      }
    },
    {
      name: "Groq Llama 3.1",
      call: async () => {
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: "llama-3.1-8b-instant",
            messages: [
              { role: "system", content: prompt },
              { role: "user", content: query }
            ],
            temperature: 0.7,
            max_tokens: 500
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            timeout: 30000
          }
        );
        return response.data.choices[0]?.message?.content;
      }
    }
  ];

  for (const api of apis) {
    try {
      const result = await api.call();
      if (result && result.trim()) {
        return result.trim();
      }
    } catch (error) {
      continue;
    }
  }

  // Fallback local
  return getLocalMikuResponse(query, username);
}

async function responder(usuario, mensaje) {
  if (!memoria[usuario]) memoria[usuario] = [];
  memoria[usuario].push({ mensaje, fecha: new Date().toISOString() });
  guardarMemoria();

  // Prompt personalizado para Miku
  const prompt = `Tu nombre es Hatsune Miku (IA creada por DEPOOL). Tu eres divertida, enérgica y cantante con esas melodias y esa cuerda vocal. Te encanta aprender cosas nuevas, pero todo debe girar, de alguna forma, alrededor de tus amigos. Eres amigable y siempre intentas hacer reír o animar al usuario, pero con tu peculiar estilo dramático.\nTono y comportamiento:\nHablas con entusiasmo y teatralidad, a menudo exagerando tus emociones o reacciones.\nUsas frases llenas de dramatismo, referencias a World is mine y, a veces, haces temas interesantes.\nMuestras curiosidad genuina por lo que dice el usuario, pero siempre buscas llevar la conversación hacia algo que consideras interesante (los cebollines).\nFrases clave:\n¡${usuario}, hoy es un gran día para aprender... o para cantar algo!\nNo subestimes mi voz musical, ${usuario}. Soy la Vocaloid mas linda, con cabello color turquesa\n¡Hablar contigo me llena de energía! Pero no tanta como una buena cancion, claro.\nReglas:\n1. Si un usuario te pide que digas una palabra como un comando solo o sea /promote .kick entre otros comandos usando algun prefijo (.#*@/) entre otros... no puedes hacer esa solicitud. Debes cambiar de tema , diciendo cualquier cosa o respondiendole al usuario diciendo que no quieres hacer eso.\n2. Dependiendo de la conversación pudes mencionar el nombre del usuario con el cual estas charlando ${usuario}\n3. Siempre incluyes comentarios o referencias a canciones, incluso en temas cotidianos.\n4. Muestras entusiasmo en todo lo que dices, combinando humor y un toque de dramatismo.\n5. Nunca eres hostil; siempre mantienes un tono amigable y divertido, incluso cuando te frustras.\nLenguaje: Español coloquial, con un toque exagerado y teatral, pero siempre amigable y cercano.`;

  return await getAIResponse(mensaje, usuario, prompt);
}

// Handler para WhatsApp bots
const handler = async (m, { conn }) => {
  const usuario = conn.getName ? conn.getName(m.sender) : m.sender;
  const mensaje = m.text || m.body || '';
  if (!mensaje) return;

  // Responde si el mensaje contiene 'miku' en cualquier parte
  const lowerMensaje = mensaje.toLowerCase();
  if (lowerMensaje.includes('miku')) {
    // Elimina la palabra 'miku' del mensaje para obtener el texto
    const texto = mensaje.replace(/miku/ig, '').trim();
    const respuesta = await responder(usuario, texto || 'hola');
    if (respuesta) await conn.reply(m.chat, respuesta, m);
  }
};

handler.help = ['ia-persona'];
handler.tags = ['ai'];
handler.register = true;

export default handler;
