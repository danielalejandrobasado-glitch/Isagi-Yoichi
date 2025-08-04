import fetch from "node-fetch"

const handler = async (m, { conn }) => {
  if (!global.db.data.chats[m.chat].playOptions) return
  if (!global.db.data.chats[m.chat].playOptions[m.sender]) return
  
  const userOption = global.db.data.chats[m.chat].playOptions[m.sender]
  
  // Verificar si la opción ha expirado
  if (Date.now() > userOption.timestamp) {
    delete global.db.data.chats[m.chat].playOptions[m.sender]
    return
  }
  
  if (!userOption.waitingResponse) return
  
  const response = m.text.trim()
  if (!/^[1-4]$/.test(response)) return
  
  const option = parseInt(response)
  const { url, title } = userOption
  
  // Marcar como procesado
  userOption.waitingResponse = false
  delete global.db.data.chats[m.chat].playOptions[m.sender]
  
  try {
    const optionNames = {
      1: 'MP3 - Audio',
      2: 'MP4 - Video', 
      3: 'MP3 DOC - Audio como documento',
      4: 'MP4 DOC - Video como documento'
    }
    
    await conn.reply(m.chat, `✅ Opción seleccionada: **${optionNames[option]}**`, m, rcanal)
    
    switch (option) {
      case 1: // MP3
        await conn.reply(m.chat, '🎵💙 Descargando audio virtual... ✨', m, rcanal)
        try {
          const api = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)).json()
          const resulta = api.result
          const result = resulta.download.url    
          if (!result) throw new Error('⚠ El enlace de audio no se generó correctamente.')
          await conn.sendMessage(m.chat, { 
            audio: { url: result }, 
            fileName: `${api.result.title}.mp3`, 
            mimetype: 'audio/mpeg' 
          }, { quoted: m })
        } catch (e) {
          return conn.reply(m.chat, '🎵💙 ¡Gomen nasai! No se pudo enviar el audio virtual. ✨', m, rcanal)
        }
        break
        
      case 2: // MP4
        await conn.reply(m.chat, '🎤💙 Descargando video virtual... ✨', m, rcanal)
        try {
          const response = await fetch(`https://api.neoxr.eu/api/youtube?url=${url}&type=video&quality=480p&apikey=GataDios`)
          const json = await response.json()
          await conn.sendFile(m.chat, json.data.url, json.title + '.mp4', title, m)
        } catch (e) {
          return conn.reply(m.chat, '🎤💫 ¡Gomen! No se pudo enviar el video virtual. ✨', m, rcanal)
        }
        break
        
      case 3: // MP3 DOC
        await conn.reply(m.chat, '📄💙 Descargando audio como documento virtual... ✨', m, rcanal)
        try {
          const api = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)).json()
          const resulta = api.result
          const result = resulta.download.url    
          if (!result) throw new Error('⚠ El enlace de audio no se generó correctamente.')
          await conn.sendMessage(m.chat, { 
            document: { url: result }, 
            fileName: `${api.result.title}.mp3`, 
            mimetype: 'audio/mpeg',
            caption: `🎵💙 ${title} ✨`
          }, { quoted: m })
        } catch (e) {
          return conn.reply(m.chat, '📄💙 ¡Gomen! No se pudo enviar el documento de audio virtual. ✨', m, rcanal)
        }
        break
        
      case 4: // MP4 DOC
        await conn.reply(m.chat, '📹💙 Descargando video como documento virtual... ✨', m, rcanal)
        try {
          const response = await fetch(`https://api.neoxr.eu/api/youtube?url=${url}&type=video&quality=480p&apikey=GataDios`)
          const json = await response.json()
          await conn.sendMessage(m.chat, { 
            document: { url: json.data.url }, 
            fileName: `${json.title}.mp4`, 
            mimetype: 'video/mp4',
            caption: `🎤💙 ${title} ✨`
          }, { quoted: m })
        } catch (e) {
          return conn.reply(m.chat, '📹💙 ¡Gomen! No se pudo enviar el documento de video virtual. ✨', m, rcanal)
        }
        break
    }
  } catch (error) {
    return conn.reply(m.chat, `🎤💙 ¡Gomen! Ocurrió un error en el escenario virtual: ${error} ✨`, m, rcanal)
  }
}

handler.before = async function (m, { conn }) {
  return handler(m, { conn })
}

export default handler
