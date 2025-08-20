import { createHash } from 'crypto' 
import fetch from 'node-fetch'

const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  let bot = global.db.data.settings[conn.user.jid] || {}
  let type = command.toLowerCase()
  let isAll = false, isUser = false
  let isEnable = chat[type] || false

 
  if (command === 'enable') {
    if (args[0]) {
      type = args[0].toLowerCase()
      isEnable = true
    } else {
      const funcionesDisponibles = [
        '⚽️ **FUNCIONES DISPONIBLES PARA ACTIVAR:**\n',
        '┌─⊷ **GRUPO**',
        '│ • welcome/bienvenida - Mensaje de bienvenida',
        '│ • antibot/antibots - Anti bots',
        '│ • autoaceptar - Auto aceptar usuarios',
        '│ • autorechazar - Auto rechazar usuarios',
        '│ • autoresponder - Respuestas automáticas',
        '│ • antisubbots/antibot2 - Anti sub-bots',
        '│ • modoadmin/soladmin - Solo administradores',
        '│ • reaction/reaccion - Reacciones automáticas',
        '│ • nsfw/modohorny - Contenido NSFW',
        '│ • detect/avisos - Detectar cambios del grupo',
        '│ • antilink - Anti enlaces',
        '│ • antifake - Anti números falsos',
        '│ • autolevelup/autonivel - Subir nivel automático',
        '│ • antispam - Anti spam',
        '├─⊷ **BOT GLOBAL**',
        '│ • antiprivado/antiprivate - Anti chat privado',
        '│ • restrict/restringir - Modo restricción',
        '│ • jadibotmd/modejadibot - Modo jadibot',
        '│ • subbots - Sub-bots',
        '└─────────────────',
        '',
        `> Uso: *${usedPrefix}enable [función]*`,
        `> Ejemplo: *${usedPrefix}enable antilink*`
      ].join('\n')
      
      return conn.reply(m.chat, funcionesDisponibles, m)
    }
  } else if (command === 'disable') {
    if (args[0]) {
      type = args[0].toLowerCase()
      isEnable = false
    } else {
      const funcionesDisponibles = [
        '⚽️ **FUNCIONES DISPONIBLES PARA DESACTIVAR:**\n',
        '┌─⊷ **GRUPO**',
        '│ • welcome/bienvenida - Mensaje de bienvenida',
        '│ • antibot/antibots - Anti bots',
        '│ • autoaceptar - Auto aceptar usuarios',
        '│ • autorechazar - Auto rechazar usuarios',
        '│ • autoresponder - Respuestas automáticas',
        '│ • antisubbots/antibot2 - Anti sub-bots',
        '│ • modoadmin/soladmin - Solo administradores',
        '│ • reaction/reaccion - Reacciones automáticas',
        '│ • nsfw/modohorny - Contenido NSFW',
        '│ • detect/avisos - Detectar cambios del grupo',
        '│ • antilink - Anti enlaces',
        '│ • antifake - Anti números falsos',
        '│ • autolevelup/autonivel - Subir nivel automático',
        '│ • antispam - Anti spam',
        '├─⊷ **BOT GLOBAL**',
        '│ • antiprivado/antiprivate - Anti chat privado',
        '│ • restrict/restringir - Modo restricción',
        '│ • jadibotmd/modejadibot - Modo jadibot',
        '│ • subbots - Sub-bots',
        '└─────────────────',
        '',
        `> Uso: *${usedPrefix}disable [función]*`,
        `> Ejemplo: *${usedPrefix}disable antilink*`
      ].join('\n')
      
      return conn.reply(m.chat, funcionesDisponibles, m)
    }
  } else if (args[0] === 'on' || args[0] === 'enable') {
    isEnable = true;
  } else if (args[0] === 'off' || args[0] === 'disable') {
    isEnable = false
  } else {
    const estado = isEnable ? '✓ Activado' : '✗ Desactivado'
    return conn.reply(m.chat, `⚽️ Un administrador puede activar o desactivar el *${command}* utilizando:\n\n> ✐ *${usedPrefix}${command} on* para activar.\n> ✐ *${usedPrefix}${command} off* para desactivar.\n> ✐ *${usedPrefix}enable ${command}* para activar.\n> ✐ *${usedPrefix}disable ${command}* para desactivar.\n\n✧ Estado actual » *${estado}*`, m, rcanal)
  }

  switch (type) {
    case 'welcome':
    case 'bienvenida':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.welcome = isEnable
      break  
      
    case 'antiprivado':
    case 'antiprivate':
      isAll = true
      if (!isOwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      bot.antiPrivate = isEnable
      break

    case 'restrict':
    case 'restringir':
      isAll = true
      if (!isOwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      bot.restrict = isEnable
      break

    case 'antibot':
    case 'antibots':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiBot = isEnable
      break

    case 'autoaceptar':
    case 'aceptarauto':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.autoAceptar = isEnable
      break

    case 'autorechazar':
    case 'rechazarauto':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.autoRechazar = isEnable
      break

    case 'autoresponder':
    case 'autorespond':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.autoresponder = isEnable
      break

    case 'antisubbots':
    case 'antibot2':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiBot2 = isEnable
      break

    case 'modoadmin':
    case 'soloadmin':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.modoadmin = isEnable;
      break;

    case 'reaction':
    case 'reaccion':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.reaction = isEnable
      break
      
    case 'nsfw':
    case 'modohorny':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.nsfw = isEnable
      break

    case 'jadibotmd':
    case 'modejadibot':
      isAll = true
      if (!isOwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      bot.jadibotmd = isEnable
      break

    case 'detect':
    case 'avisos':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.detect = isEnable
      break

    case 'antilink':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiLink = isEnable
      break

    case 'antifake':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antifake = isEnable
      break
      
    case 'autolevelup':
    case 'autonivel':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.autolevelup = isEnable
      break
      
    case 'antispam':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antispam = isEnable
      break
      
    case 'subbots':
      isAll = true
      if (!isOwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      bot.subbots = isEnable
      break
  }
  
  chat[type] = isEnable;

  conn.reply(m.chat, `⚽️ La función *${type}* se *${isEnable ? 'activó' : 'desactivó'}* ${isAll ? 'para este Bot' : isUser ? '' : 'para este chat'}`, m, rcanal);
};

handler.help = ['welcome', 'bienvenida', 'antiprivado', 'antiprivate', 'restrict', 'restringir', 'autolevelup', 'autonivel', 'antibot', 'antibots', 'autoaceptar', 'aceptarauto', 'autorechazar', 'rechazarauto', 'autoresponder', 'autorespond', 'antisubbots', 'antibot2', 'modoadmin', 'soloadmin', 'reaction', 'reaccion', 'nsfw', 'modohorny', 'antispam', 'jadibotmd', 'modejadibot', 'subbots', 'detect', 'avisos', 'antilink', 'enable', 'disable']
handler.tags = ['nable'];
handler.command = ['welcome', 'bienvenida', 'antiprivado', 'antiprivate', 'restrict', 'restringir', 'autolevelup', 'autonivel', 'antibot', 'antibots', 'autoaceptar', 'aceptarauto', 'autorechazar', 'rechazarauto', 'autoresponder', 'autorespond', 'antisubbots', 'antibot2', 'modoadmin', 'soloadmin', 'reaction', 'reaccion', 'nsfw', 'modohorny', 'antispam', 'jadibotmd', 'modejadibot', 'subbots', 'detect', 'avisos', 'antilink', 'antifake', 'enable', 'disable']

export default handler
