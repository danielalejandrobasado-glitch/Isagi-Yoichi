import fs from 'fs';
import path from 'path';
const MEMORIA_FILE = 'memoria.json';

let getAIResponse = null;
try {
  const iaModule = await import(path.resolve(path.dirname(import.meta.url.replace('file://', '')), 'ia.js'));
  getAIResponse = iaModule.getAIResponse;
} catch (e) {
  getAIResponse = null;
}

const paisesTaurinos = [
  'España', 'México', 'Colombia', 'Perú', 'Venezuela', 'Ecuador', 'Francia', 'Portugal'
];

let memoria = {};
if (fs.existsSync(MEMORIA_FILE)) {
  memoria = JSON.parse(fs.readFileSync(MEMORIA_FILE, 'utf8'));
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


// Handler para WhatsApp bots
const handler = async (m, { conn }) => {
  const usuario = conn.getName ? conn.getName(m.sender) : m.sender;
  const mensaje = m.text || m.body || '';
  if (!mensaje) return;

  // Solo responde si el mensaje inicia con "Miku " (sin prefijo)
  if (/^miku\s+/i.test(mensaje)) {
    const texto = mensaje.replace(/^miku\s+/i, '');
    const respuesta = await responder(usuario, texto);
    if (respuesta) await conn.reply(m.chat, respuesta, m);
  }
};

handler.help = ['ia-persona'];
handler.tags = ['ai'];
handler.command = ['ia-persona'];
handler.register = true;

export default handler;


