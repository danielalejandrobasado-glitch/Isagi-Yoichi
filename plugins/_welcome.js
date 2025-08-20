import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;
  const fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net"}  
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://files.catbox.moe/wm4w1x.jpg')
  let img = await (await fetch(`${pp}`)).buffer()
  let chat = global.db.data.chats[m.chat]
  let txt = '⚽ ¡nuevo integrante del club! ⚽'
  let txt1 = '⚽ ¡hasta nunca egoísta!⚽'
  let groupSize = participants.length
  if (m.messageStubType == 27) {
    groupSize++;
  } else if (m.messageStubType == 28 || m.messageStubType == 32) {
    groupSize--;
  }

  if (chat.welcome && m.messageStubType == 27) {
    let bienvenida = `⚽*bienvenido a Blue lock, egoísta ⚽ ${groupMetadata.subject}⚽\n\n⚽ @${m.messageStubParameters[0].split`@`[0]} ⚽️\n\n⚽️ ${global.welcom1} ⚽️\n\n⚽️ ¡Ahora somos ${groupSize} jugadores! ⚽️\n\n⚽️ ¡Prepárate para jugar con nosotros! (◕‿◕)♡ ⚽️\n\n> ⚽️ Usa *#help* para ver todos los comandos de Isagi! ⚽️\n SIGUE NUESTRO CANAL \n https://whatsapp.com/channel/0029Vb73g1r1NCrTbefbFQ2T\n> EGOISTA`    
    await conn.sendMini(m.chat, txt, dev, bienvenida, img, img, redes, fkontak, m, rcanal)
  }
  
  if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32)) {
    let bye = `⚽*! fuiste bueno pero no el mejor* ${groupMetadata.subject} hasta nunca ⚽\n\n⚽ @${m.messageStubParameters[0].split`@`[0]} ⚽️\n\n⚽️ ${global.welcom2} ⚽️\n\n⚽️Ahora somos ${groupSize} jugadores esperándote ⚽️\n\n⚽️ ¡Esperamos verte pronto en nuestro próximo campeonato! (｡◕‿◕｡) ⚽️\n\n> ⚽️ ¡La disciplina siempre te acompañará! ⚽️\n SIGUE NUESTRO CANAL \n https://www.whatsapp.com/channel/0029VajYamSIHphMAl3ABi1o\n> EGOISTA `
    await conn.sendMini(m.chat, txt1, dev, bye, img, img, redes, fkontak, m, rcanal)
  }}
