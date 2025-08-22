import { canLevelUp } from '../lib/levelling.js'

const roles = {
'*⚽ instinto goleador ⚽*': 0,
'*⚽ vision periferica ⚽*': 2,
'*⚽ desmarque veloz ⚽*': 4,
'*⚽ definición clínica  ⚽*': 6,
'*⚽ Nivel Regate en corto ⚽*': 8,
'*⚽ Nivel Anticipación defensiva ⚽*': 10,
'*⚽ visión alta ⚽*': 12,
'*⚽ Juego aéreo ⚽*': 14,
'*⚽ Potencia de disparo ⚽*': 16,
'*⚽ Pase filtrado ⚽*': 18,
'*⚽ Conexión en equipo ⚽*': 20,
'*⚽ Reflejos de portero ⚽*': 22,
'*⚽ Reacción inmediata ⚽*': 24,
'*⚽ Control orientado ⚽*': 26,
'*⚽ Finta inesperada ⚽*': 28,
'*⚽ Equilibrio corporal ⚽*': 30,
'*⚽ Lectura de juego ⚽*': 32,
'*⚽ Cambio de ritmo ⚽*': 34,
'*⚽ Resistencia física ⚽*': 36,
'*⚽ Agresividad táctica ⚽*': 38,
'*⚽ Agresividad táctica ⚽*': 40,
'*⚽ Toque de primera ⚽*': 42,
'*⚽ Tiros de larga distancia ⚽*': 44,
'*⚽ Recuperación rápida ⚽*': 46,
'*⚽ Entrada limpia ⚽*': 48,
'*⚽ Inteligencia espacial ⚽*': 50,
'*⚽ Juego de espaldas ⚽ *': 52,
'*⚽ Tiro cruzado ⚽*': 54,
'*⚽ Autoconfianza ⚽*': 56,
'*⚽ Disparo de volea ⚽*': 58,
'*⚽ Conducción de balón ⚽*': 60,
'*⚽ Cabeceo ofensivo ⚽*': 62,
'* nivel troll 🗣️🔥🔥 *': 64,
'*⚽ Bloqueo defensivo ⚽*': 66,
'*⚽ Posicionamiento en área ⚽ *': 68,
'*⚽ Contraataque veloz ⚽*': 70,
'*⚽ Efecto en el balón ⚽*': 72,
'*⚽ Amplitud de campo ⚽*': 74,
'*⚽ Cambio de orientación ⚽*': 76,
'*⚽ Juego al primer toque ⚽*': 78,
'*⚽ Movilidad constante ⚽*': 80,
'*⚽ Adaptación rápida ⚽*': 85,
'*⚽ Concentración máxima ⚽*': 90,
'*⚽ Pase largo preciso ⚽*': 95,
'*⚽ Tiros libres potentes ⚽*': 99,
'*⚽ Saque de esquina estratégico ⚽*': 100,
'*⚽ Mentalidad fría ⚽*': 110,
'*⚽ Instinto asesino ⚽*': 120,
'*⚽ Agilidad felina ⚽*': 130,
'*💙🎵 Leyenda Musical I 🎵💙*': 140,
'*🎤👑 Soberano(a) Virtual V 👑🎤*': 150,
'*🎤👑 Soberano(a) Virtual IV 👑🎤*': 160,
'*🎤👑 Soberano(a) Virtual III 👑🎤*': 170,
'*🎤👑 Soberano(a) Virtual II 👑🎤*': 180,
'*🎤👑 Soberano(a) Virtual I 👑🎤*': 199,
'*💫🌟 Titán(a) Digital V 🌟💫*': 200,
'*💫🌟 Titán(a) Digital IV 🌟💫*': 225,
'*💫🌟 Titán(a) Digital III 🌟💫*': 250,
'*💫🌟 Titán(a) Digital II 🌟💫*': 275,
'*💫🌟 Titán(a) Digital I 🌟💫*': 299,
'*🎵💎 Guardián(a) de Armonías V 💎🎵*': 300,
'*🎵💎 Guardián(a) de Armonías IV 💎🎵*': 325,
'*🎵💎 Guardián(a) de Armonías III 💎🎵*': 350,
'*🎵💎 Guardián(a) de Armonías II 💎🎵*': 375,
'*🎵💎 Guardián(a) de Armonías I 💎🎵*': 399,
'*🎤✨ Maestro(a) Vocaloid V ✨🎤*': 400,
'*🎤✨ Maestro(a) Vocaloid IV ✨🎤*': 425,
'*🎤✨ Maestro(a) Vocaloid III ✨🎤*': 450,
'*🎤✨ Maestro(a) Vocaloid II ✨🎤*': 475,
'*🎤✨ Maestro(a) Vocaloid I ✨🎤*': 499,
'*🌟💙 Señor(a) de las Melodías V 💙🌟*': 500,
'*🌟💙 Señor(a) de las Melodías IV 💙🌟*': 525,
'*🌟💙 Señor(a) de las Melodías III 💙🌟*': 550,
'*🌟💙 Señor(a) de las Melodías II 💙🌟*': 575,
'*🌟💙 Señor(a) de las Melodías I 💙🌟*': 599,
'*🎵👑 Héroe(a) Musical Inmortal V 👑🎵*': 600,
'*🎵👑 Héroe(a) Musical Inmortal IV 👑🎵*': 625,
'*🎵👑 Héroe(a) Musical Inmortal III 👑🎵*': 650,
'*🎵👑 Héroe(a) Musical Inmortal II 👑🎵*': 675,
'*🎵👑 Héroe(a) Musical Inmortal I 👑🎵*': 699,
'*💫🎤 Maestro(a) del Mundo Virtual V 🎤💫*': 700,
'*💫🎤 Maestro(a) del Mundo Virtual IV 🎤💫*': 725,
'*💫🎤 Maestro(a) del Mundo Virtual III 🎤💫*': 750,
'*💫🎤 Maestro(a) del Mundo Virtual II 🎤💫*': 775,
'*💫🎤 Maestro(a) del Mundo Virtual I 🎤💫*': 799,
'*✨💎 Sabio(a) de las Frecuencias V 💎✨*': 800,
'*✨💎 Sabio(a) de las Frecuencias IV 💎✨*': 825,
'*✨💎 Sabio(a) de las Frecuencias III 💎✨*': 850,
'*✨💎 Sabio(a) de las Frecuencias II 💎✨*': 875,
'*✨💎 Sabio(a) de las Frecuencias I 💎✨*': 899,
'*🌟🎵 Viajero(a) del Ciberespacio V 🎵🌟*': 900,
'*🌟🎵 Viajero(a) del Ciberespacio IV 🎵🌟*': 925,
'*🌟🎵 Viajero(a) del Ciberespacio III 🎵🌟*': 950,
'*🌟🎵 Viajero(a) del Ciberespacio II 🎵🌟*': 975,
'*🌟🎵 Viajero(a) del Ciberespacio I 🎵🌟*': 999,
'*💙👑 Deidad Virtual Eterna V 👑💙*': 1000,
'*💙👑 Deidad Virtual Eterna IV 👑💙*': 2000,
'*💙👑 Deidad Virtual Eterna III 👑💙*': 3000,
'*💙👑 Deidad Virtual Eterna II 👑💙*': 4000,
'*💙👑 Deidad Virtual Eterna I 👑💙*': 5000,
'*🎤✨💫 Gran Diva del Infinito Digital 💫✨🎤*': 10000,
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
