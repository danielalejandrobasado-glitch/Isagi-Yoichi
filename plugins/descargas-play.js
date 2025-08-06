import fetch from "node-fetch"
import yts from 'yt-search'
import axios from "axios"

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/


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
  },
  
  {
    url: (videoUrl) => `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${videoUrl}`,
    method: 'GET',
    extractUrl: (data) => data.url,
    extractTitle: (data) => data.title
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
  },
  {
    url: (videoUrl) => `https://api.ryzendesu.vip/api/downloader/ytmp4?url=${videoUrl}`,
    method: 'GET',
    extractUrl: (data) => data.url,
    extractTitle: (data) => data.title
  }
]


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
          } else {
            console.log(`❌ URL de audio inválida de API ${apiIndex + 1}`)
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
          } else {
            console.log(`❌ URL de video inválida de API ${apiIndex + 1}`)
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


function isDurationAcceptable(timestamp) {
  if (!timestamp) return true
  
 
  const parts = timestamp.split(':').map(Number)
  let totalSeconds = 0
  
  if (parts.length === 3) { // HH:MM:SS
    totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2]
  } else if (parts.length === 2) { // MM:SS
    totalSeconds = parts[0] * 60 + parts[1]
  } else {
    totalSeconds = parts[0] || 0
  }
  
  
  return totalSeconds <= 1800
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `🎤💙 ¡Ara ara! Por favor, dime el nombre de la canción que quieres que descargue para ti. 🎵✨`, m, rcanal)
    }
  
    let videoIdToFind = text.match(youtubeRegexID) || null
    let ytplay2 = await yts(videoIdToFind === null ? text : 'https://youtu.be/' + videoIdToFind[1])

    if (videoIdToFind) {
      const videoId = videoIdToFind[1]  
      ytplay2 = ytplay2.all.find(item => item.videoId === videoId) || ytplay2.videos.find(item => item.videoId === videoId)
    } 
    ytplay2 = ytplay2.all?.[0] || ytplay2.videos?.[0] || ytplay2  
    
    if (!ytplay2 || ytplay2.length == 0) {
      return m.reply('🎵💙 ¡Gomen! No encontré ninguna canción con ese nombre. ¿Podrías intentar con otro título? ✨')
    }

    let { title, thumbnail, timestamp, views, ago, url, author } = ytplay2
    title = title || 'no encontrado'
    thumbnail = thumbnail || 'no encontrado'
    timestamp = timestamp || 'no encontrado'
    views = views || 'no encontrado'
    ago = ago || 'no encontrado'
    url = url || 'no encontrado'
    author = author || 'no encontrado'

   
    if (!isDurationAcceptable(timestamp)) {
      return conn.reply(m.chat, `🎵💙 ¡Gomen! El video es demasiado largo (${timestamp}). Por favor, elige un video de menos de 30 minutos para garantizar una descarga estable. ✨`, m)
    }

    const vistas = formatViews(views)
    const canal = author.name ? author.name : 'Desconocido'
    const infoMessage = `🎤💙 「✨」Descargando melodía virtual *<${title || 'Desconocido'}>* 🎵\n\n🎶 Canal Musical » *${canal}*\n💫 Visualizaciones » *${vistas || 'Desconocido'}*\n⏰ Duración » *${timestamp || 'Desconocido'}*\n✨ Publicado » *${ago || 'Desconocido'}*\n🌟 Link Virtual » ${url}\n\n💙 ¡Preparando tu canción favorita con sistema mejorado! ✨`
    
    const thumb = (await conn.getFile(thumbnail))?.data
    const JT = {
      contextInfo: {
        externalAdReply: {
          title: botname,
          body: dev,
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
      },
    }
    
    const optionsMessage = `${infoMessage}\n\n🎯 *Opciones de Descarga Mejoradas:*\n\n1️⃣ *MP3* - Audio únicamente 🎵 (Recomendado)\n2️⃣ *MP4* - Video completo 🎬\n3️⃣ *MP3 DOC* - Audio como documento 📄\n4️⃣ *MP4 DOC* - Video como documento 📹\n\n💙 *Responde con el número (1, 2, 3 o 4) de tu opción preferida* ✨\n⏰ *Tienes 90 segundos para elegir*`
    
    await conn.reply(m.chat, optionsMessage, m, JT)
    
    if (!global.db.data.chats[m.chat].playOptions) {
      global.db.data.chats[m.chat].playOptions = {}
    }
    
    global.db.data.chats[m.chat].playOptions[m.sender] = {
      url: url,
      title: title,
      thumbnail: thumbnail,
      timestamp: Date.now() + 90000, 
      waitingResponse: true
    }
  } catch (error) {
    console.error('Error en handler principal:', error)
    return m.reply(`🎤💙 ¡Gomen! Ocurrió un error en el escenario virtual: ${error.message} ✨`)
  }
}

handler.command = handler.help = ['play', 'música', 'musica', 'song', 'cancion']
handler.tags = ['descargas']
handler.group = false

export default handler

function formatViews(views) {
  if (views === undefined) {
    return "No disponible"
  }

  if (views >= 1_000_000_000) {
    return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`
  } else if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`
  } else if (views >= 1_000) {
    return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`
  }
  return views.toString()
}
