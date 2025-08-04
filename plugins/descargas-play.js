import fetch from "node-fetch"
import yts from 'yt-search'
import axios from "axios"
const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

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
    const vistas = formatViews(views)
    const canal = author.name ? author.name : 'Desconocido'
    const infoMessage = `🎤💙 「✨」Descargando melodía virtual *<${title || 'Desconocido'}>* 🎵\n\n🎶 Canal Musical » *${canal}*\n💫 Visualizaciones » *${vistas || 'Desconocido'}*\n⏰ Duración » *${timestamp || 'Desconocido'}*\n✨ Publicado » *${ago || 'Desconocido'}*\n🌟 Link Virtual » ${url}\n\n💙 ¡Preparando tu canción favorita! ✨`
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
    // Mostrar opciones de descarga
    const optionsMessage = `${infoMessage}\n\n🎯 **Opciones de Descarga:**\n\n1️⃣ **MP3** - Audio únicamente 🎵\n2️⃣ **MP4** - Video completo 🎬\n3️⃣ **MP3 DOC** - Audio como documento 📄\n4️⃣ **MP4 DOC** - Video como documento 📹\n\n💙 *Responde con el número (1, 2, 3 o 4) de tu opción preferida* ✨\n⏰ *Tienes 60 segundos para elegir*`
    
    await conn.reply(m.chat, optionsMessage, m, JT)
    
    // Guardar información en base de datos para la respuesta
    if (!global.db.data.chats[m.chat].playOptions) {
      global.db.data.chats[m.chat].playOptions = {}
    }
    
    global.db.data.chats[m.chat].playOptions[m.sender] = {
      url: url,
      title: title,
      thumbnail: thumbnail,
      timestamp: Date.now() + 60000, // Expira en 60 segundos
      waitingResponse: true
    }
  } catch (error) {
    return m.reply(`🎤💙 ¡Gomen! Ocurrió un error en el escenario virtual: ${error} ✨`)
  }
}
handler.command = handler.help = ['play', 'música', 'musica', 'song', 'cancion']
handler.tags = ['descargas']
handler.group = true

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
