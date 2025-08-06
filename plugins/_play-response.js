import fetch from "node-fetch"


async function validateUrl(url, timeout = 10000) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    })
    
    clearTimeout(timeoutId)
    return response.ok && response.headers.get('content-length') > 0
  } catch (error) {
    return false
  }
}


const audioApis = [
  {
    url: (videoUrl) => `https://api.cobalt.tools/api/json`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: (videoUrl) => JSON.stringify({ url: videoUrl, vCodec: "h264", vQuality: "720", aFormat: "mp3" }),
    extractUrl: (data) => data.url,
    extractTitle: (data) => data.filename?.replace('.mp3', '') || null
  },
  {
    url: (videoUrl) => `https://api.davidjsmoreno.dev/ytmp3?url=${videoUrl}`,
    method: 'GET',
    extractUrl: (data) => data.url || data.link,
    extractTitle: (data) => data.title
  },
  {
    url: (videoUrl) => `https://api.vreden.my.id/api/ytmp3?url=${videoUrl}`,
    method: 'GET',
    extractUrl: (data) => data.result?.download?.url,
    extractTitle: (data) => data.result?.title
  },
  {
    url: (videoUrl) => `https://api.botcahx.biz.id/api/dowloader/yt?url=${videoUrl}&apikey=Admin`,
    method: 'GET',
    extractUrl: (data) => data.result?.mp3,
    extractTitle: (data) => data.result?.title
  },
  {
    url: (videoUrl) => `https://api.lolhuman.xyz/api/ytaudio?apikey=GataDios&url=${videoUrl}`,
    method: 'GET',
    extractUrl: (data) => data.result?.link || data.result?.audio?.link,
    extractTitle: (data) => data.result?.title
  }
]

const videoApis = [
  {
    url: (videoUrl) => `https://api.cobalt.tools/api/json`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: (videoUrl) => JSON.stringify({ url: videoUrl, vCodec: "h264", vQuality: "720" }),
    extractUrl: (data) => data.url,
    extractTitle: (data) => data.filename?.replace('.mp4', '') || null
  },
  {
    url: (videoUrl) => `https://api.davidjsmoreno.dev/ytmp4?url=${videoUrl}`,
    method: 'GET',
    extractUrl: (data) => data.url || data.link,
    extractTitle: (data) => data.title
  },
  {
    url: (videoUrl) => `https://api.vreden.my.id/api/ytmp4?url=${videoUrl}`,
    method: 'GET',
    extractUrl: (data) => data.result?.download?.url,
    extractTitle: (data) => data.result?.title
  },
  {
    url: (videoUrl) => `https://api.botcahx.biz.id/api/dowloader/yt?url=${videoUrl}&apikey=Admin`,
    method: 'GET',
    extractUrl: (data) => data.result?.mp4,
    extractTitle: (data) => data.result?.title
  },
  {
    url: (videoUrl) => `https://api.lolhuman.xyz/api/ytvideo?apikey=GataDios&url=${videoUrl}`,
    method: 'GET',
    extractUrl: (data) => data.result?.link || data.result?.video?.link,
    extractTitle: (data) => data.result?.title
  }
]

async function getAudioUrl(videoUrl, maxRetries = 3) {
  for (let apiIndex = 0; apiIndex < audioApis.length; apiIndex++) {
    const api = audioApis[apiIndex]
    
    for (let retry = 0; retry < maxRetries; retry++) {
      try {
        console.log(`🔄 Intentando API de audio ${apiIndex + 1}, intento ${retry + 1}`)
        
        let response
        const requestUrl = typeof api.url === 'function' ? api.url(videoUrl) : api.url
        
        if (api.method === 'POST') {
          response = await fetch(requestUrl, {
            method: 'POST',
            headers: api.headers || { 'Content-Type': 'application/json' },
            body: api.body ? api.body(videoUrl) : JSON.stringify({ url: videoUrl }),
            timeout: 30000
          })
        } else {
          response = await fetch(requestUrl, { timeout: 30000 })
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        
        const data = await response.json()
        const audioUrl = api.extractUrl(data)
        const title = api.extractTitle(data)
        
        if (audioUrl) {
          const isValid = await validateUrl(audioUrl)
          if (isValid) {
            console.log(`✅ Audio obtenido exitosamente de API ${apiIndex + 1}`)
            return { url: audioUrl, title: title }
          }
        }
        
      } catch (error) {
        console.error(`❌ API de audio ${apiIndex + 1}, intento ${retry + 1} falló:`, error.message)
        
        if (retry < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000 * (retry + 1)))
        }
      }
    }
  }
  
  return null
}

async function getVideoUrl(videoUrl, maxRetries = 3) {
  for (let apiIndex = 0; apiIndex < videoApis.length; apiIndex++) {
    const api = videoApis[apiIndex]
    
    for (let retry = 0; retry < maxRetries; retry++) {
      try {
        console.log(`🔄 Intentando API de video ${apiIndex + 1}, intento ${retry + 1}`)
        
        let response
        const requestUrl = typeof api.url === 'function' ? api.url(videoUrl) : api.url
        
        if (api.method === 'POST') {
          response = await fetch(requestUrl, {
            method: 'POST',
            headers: api.headers || { 'Content-Type': 'application/json' },
            body: api.body ? api.body(videoUrl) : JSON.stringify({ url: videoUrl }),
            timeout: 45000
          })
        } else {
          response = await fetch(requestUrl, { timeout: 45000 })
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        
        const data = await response.json()
        const videoUrlResult = api.extractUrl(data)
        const title = api.extractTitle(data)
        
        if (videoUrlResult) {
          const isValid = await validateUrl(videoUrlResult)
          if (isValid) {
            console.log(`✅ Video obtenido exitosamente de API ${apiIndex + 1}`)
            return { url: videoUrlResult, title: title }
          }
        }
        
      } catch (error) {
        console.error(`❌ API de video ${apiIndex + 1}, intento ${retry + 1} falló:`, error.message)
        
        if (retry < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 3000 * (retry + 1)))
        }
      }
    }
  }
  
  return null
}


async function safeSendFile(conn, chatId, url, filename, caption, quoted, isDocument = false, mimetype) {
  const maxFileSize = 100 * 1024 * 1024; 
  const maxRetries = 3;
  
  for (let retry = 0; retry < maxRetries; retry++) {
    try {
      
      const headResponse = await fetch(url, { method: 'HEAD' });
      const fileSize = parseInt(headResponse.headers.get('content-length') || '0');
      
      if (fileSize > maxFileSize) {
        throw new Error(`Archivo demasiado grande: ${(fileSize / 1024 / 1024).toFixed(1)}MB`);
      }
      
      if (isDocument) {
        await conn.sendMessage(chatId, {
          document: { url: url },
          fileName: filename,
          mimetype: mimetype,
          caption: caption
        }, { quoted: quoted });
      } else {
        if (mimetype.includes('audio')) {
          await conn.sendMessage(chatId, {
            audio: { url: url },
            fileName: filename,
            mimetype: mimetype
          }, { quoted: quoted });
        } else {
          await conn.sendFile(chatId, url, filename, caption, quoted);
        }
      }
      
      return true; 
      
    } catch (error) {
      console.error(`❌ Error enviando archivo (intento ${retry + 1}):`, error.message);
      
      if (retry < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000 * (retry + 1)));
      } else {
        throw error; 
      }
    }
  }
  
  return false;
}

const handler = async (m, { conn }) => {
  if (!global.db.data.chats[m.chat].playOptions) return
  if (!global.db.data.chats[m.chat].playOptions[m.sender]) return
  
  const userOption = global.db.data.chats[m.chat].playOptions[m.sender]
  
  if (Date.now() > userOption.timestamp) {
    delete global.db.data.chats[m.chat].playOptions[m.sender]
    return conn.reply(m.chat, '⏰ El tiempo de selección ha expirado. Usa el comando de nuevo.', m)
  }
  
  if (!userOption.waitingResponse) return
  
  const response = m.text.trim()
  if (!/^[1-4]$/.test(response)) return
  
  const option = parseInt(response)
  const { url, title } = userOption
  
  
  userOption.waitingResponse = false
  
  try {
    const optionNames = {
      1: 'MP3 - Audio',
      2: 'MP4 - Video', 
      3: 'MP3 DOC - Audio como documento',
      4: 'MP4 DOC - Video como documento'
    }
    
    await conn.reply(m.chat, `✅ Opción seleccionada: **${optionNames[option]}**\n🔄 Procesando con sistema mejorado...`, m, rcanal)
    
    switch (option) {
      case 1: 
        await conn.reply(m.chat, '💙 Descargando audio virtual con máxima calidad... ✨', m, rcanal)
        try {
          const audioResult = await getAudioUrl(url)
          if (!audioResult || !audioResult.url) {
            throw new Error('No se pudo obtener el enlace de audio después de múltiples intentos.')
          }
          
          const success = await safeSendFile(
            conn, 
            m.chat, 
            audioResult.url, 
            `${audioResult.title || title}.mp3`, 
            null, 
            m, 
            false, 
            'audio/mpeg'
          )
          
          if (!success) {
            throw new Error('Fallo en el envío del archivo de audio')
          }
          
          await conn.reply(m.chat, '✅ ¡Audio enviado exitosamente! 💙✨', m)
          
        } catch (e) {
          console.error('Error descargando audio:', e)
          return conn.reply(m.chat, `💙 ¡Gomen nasai! Error al procesar audio: ${e.message}. Intenta de nuevo en unos momentos. ✨`, m, rcanal)
        }
        break
        
      case 2: 
        await conn.reply(m.chat, '💙 Descargando video virtual con máxima calidad... ✨', m, rcanal)
        try {
          const videoResult = await getVideoUrl(url)
          if (!videoResult || !videoResult.url) {
            throw new Error('No se pudo obtener el enlace de video después de múltiples intentos.')
          }
          
          const success = await safeSendFile(
            conn, 
            m.chat, 
            videoResult.url, 
            `${videoResult.title || title}.mp4`, 
            title, 
            m, 
            false, 
            'video/mp4'
          )
          
          if (!success) {
            throw new Error('Fallo en el envío del archivo de video')
          }
          
          await conn.reply(m.chat, '✅ ¡Video enviado exitosamente! 💙✨', m)
          
        } catch (e) {
          console.error('Error descargando video:', e)
          return conn.reply(m.chat, `💫 ¡Gomen! Error al procesar video: ${e.message}. Intenta de nuevo en unos momentos. ✨`, m, rcanal)
        }
        break
        
      case 3: 
        await conn.reply(m.chat, '💙 Descargando audio como documento virtual... ✨', m, rcanal)
        try {
          const audioResult = await getAudioUrl(url)
          if (!audioResult || !audioResult.url) {
            throw new Error('No se pudo obtener el enlace de audio después de múltiples intentos.')
          }
          
          const success = await safeSendFile(
            conn, 
            m.chat, 
            audioResult.url, 
            `${audioResult.title || title}.mp3`, 
            `💙 ${title} ✨`, 
            m, 
            true, 
            'audio/mpeg'
          )
          
          if (!success) {
            throw new Error('Fallo en el envío del documento de audio')
          }
          
          await conn.reply(m.chat, '✅ ¡Documento de audio enviado exitosamente! 💙', m)
          
        } catch (e) {
          console.error('Error descargando audio como documento:', e)
          return conn.reply(m.chat, `💙 ¡Gomen! Error al procesar documento de audio: ${e.message}. Intenta de nuevo en unos momentos. ✨`, m, rcanal)
        }
        break
        
      case 4: 
        await conn.reply(m.chat, '💙 Descargando video como documento virtual... ✨', m, rcanal)
        try {
          const videoResult = await getVideoUrl(url)
          if (!videoResult || !videoResult.url) {
            throw new Error('No se pudo obtener el enlace de video después de múltiples intentos.')
          }
          
          const success = await safeSendFile(
            conn, 
            m.chat, 
            videoResult.url, 
            `${videoResult.title || title}.mp4`, 
            `💙 ${title} ✨`, 
            m, 
            true, 
            'video/mp4'
          )
          
          if (!success) {
            throw new Error('Fallo en el envío del documento de video')
          }
          
          await conn.reply(m.chat, '✅ ¡Documento de video enviado exitosamente! 💙✨', m)
          
        } catch (e) {
          console.error('Error descargando video como documento:', e)
          return conn.reply(m.chat, `💙 ¡Gomen! Error al procesar documento de video: ${e.message}. Intenta de nuevo en unos momentos. ✨`, m, rcanal)
        }
        break
    }
    
  } catch (error) {
    console.error('Error general en el procesamiento:', error)
    return conn.reply(m.chat, `💙 ¡Gomen! Error general en el escenario virtual: ${error.message}. Por favor intenta de nuevo. ✨`, m, rcanal)
  } finally {
    
    delete global.db.data.chats[m.chat].playOptions[m.sender]
  }
}

handler.before = async function (m, { conn }) {
  return handler(m, { conn })
}

export default handler
