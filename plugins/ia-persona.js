const fs = require('fs');
const path = require('path');
const MEMORIA_FILE = 'memoria.json';

// Importar getAIResponse del otro archivo
let getAIResponse;
try {
  const iaPath = path.resolve(__dirname, 'ia.js');
  const iaModule = require(iaPath);
  getAIResponse = iaModule.getAIResponse;
} catch (e) {
  getAIResponse = null;
}

// Países taurinos
const paisesTaurinos = [
  'España', 'México', 'Colombia', 'Perú', 'Venezuela', 'Ecuador', 'Francia', 'Portugal'
];

// Cargar memoria o inicializar
let memoria = {};
if (fs.existsSync(MEMORIA_FILE)) {
  memoria = JSON.parse(fs.readFileSync(MEMORIA_FILE, 'utf8'));
}

function guardarMemoria() {
  fs.writeFileSync(MEMORIA_FILE, JSON.stringify(memoria, null, 2));
}

async function responder(usuario, mensaje) {
  // Guardar mensaje en memoria
  if (!memoria[usuario]) memoria[usuario] = [];
  memoria[usuario].push({ mensaje, fecha: new Date().toISOString() });
  guardarMemoria();

  // Si existe getAIResponse, usar la API avanzada
  if (getAIResponse) {
    try {
      const respuesta = await getAIResponse(mensaje, usuario, `Responde como una persona, incluye países taurinos en la respuesta si es relevante.`);
      if (respuesta) return respuesta;
    } catch (e) {
      // Si falla, sigue con respuesta local
    }
  }

  // Respuesta personalizada usando países taurinos
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
  // Respuesta genérica
  const pais = paisesTaurinos[Math.floor(Math.random() * paisesTaurinos.length)];
  return `Interesante, ${usuario}. En ${pais} también se habla mucho de esto. Cuéntame más.`;
}

// Simulación de entrada por consola
definirUsuario();
function definirUsuario() {
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('Escribe tu nombre de usuario: ', usuario => {
    escucharMensajes(usuario, rl);
  });
}

function escucharMensajes(usuario, rl) {
  rl.setPrompt(`${usuario}> `);
  rl.prompt();
  rl.on('line', async input => {
    // Responde automáticamente a cualquier mensaje
    const respuesta = await responder(usuario, input);
    console.log('miku:', respuesta);
    rl.prompt();
  });
}
