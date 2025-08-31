import { canLevelUp } from '../lib/levelling.js'

const roles = {
  '🌱 Novato Audaz 🌱': 0,
  '⚡ Velocidad de Desmarque ⚡': 10,
  '🎯 Definición Clínica 🎯': 20,
  '🌀 Regate en Espacios Reducidos 🌀': 30,
  '🛡️ Anticipación Defensiva 🛡️': 40,
  '👁️ Visión de Juego Avanzada 👁️': 50,
  '💥 Juego Aéreo Preciso 💥': 60,
  '💪 Disparo Potente 💪': 70,
  '🤝 Conexión en Equipo 🤝': 80,
  '⚡ Egoist Emergente ⚡': 100,
  '🔥 Striker Supremo 🔥': 120,
  '🦁 Instinto Asesino 🦁': 140,
  '🐆 Agilidad Felina 🐆': 160,
  '⚡ Regate Eléctrico ⚡': 180,
  '💎 Precisión Letal 💎': 200,
  '🚀 Giro Rápido 🚀': 220,
  '🎯 Movimientos Sorpresa 🎯': 240,
  '🛡️ Cobertura Defensiva 🛡️': 260,
  '🌟 Liderazgo Natural 🌟': 280,
  '🔥 Hambre de Gol 🔥': 300,
  '👑 Rey del Área 👑': 350,
  '💫 Genio del Regate 💫': 400,
  '⚡ Dominador del Gol ⚡': 450,
  '🌌 Maestro del Ego 🌌': 500,
  '💙 Deidad Virtual Eterna 💙': 600,
  '🎤 Gran Diva del Infinito Digital 🎤': 1000,
}

let handler = m => m
handler.before = async function (m, { conn }) {

    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let user = global.db.data.users[m.sender]

    let level = user.level
    let before = user.level * 1

    while (canLevelUp(user.level, user.exp, global.multiplier)) 
        user.level++

    if (before !== user.level) {
        let especial = 'coin'
        let especial2 = 'exp'
        let especialCant = Math.floor(Math.random() * (100 - 10 + 1)) + 10
        let especialCant2 = Math.floor(Math.random() * (100 - 10 + 1)) + 10

        if (user.level % 5 === 0) {
            user[especial] += especialCant
            user[especial2] += especialCant2
        }
    }

    let role = (Object.entries(roles).sort((a, b) => b[1] - a[1]).find(([, minLevel]) => level >= minLevel) || Object.entries(roles)[0])[0]
    user.role = role

    return !0
}

export default handler