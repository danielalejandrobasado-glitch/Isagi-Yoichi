import fetch from "node-fetch"

async function getAudioUrl(videoUrl) {
  const apis = [
    `https://api.vreden.my.id/api/ytmp3?url=${videoUrl}`,
    `https://api.botcahx.biz.id/api/dowloader/yt?url=${videoUrl}&apikey=Admin`,
    `https://api.lolhuman.xyz/api/ytaudio?apikey=GataDios&url=${videoUrl}`
  ];
  
  for (let i = 0; i < apis.length; i++) {
    try {
      const apiResponse = await fetch(apis[i]);
      const apiJson = await apiResponse.json();
      
      let audioUrl = null;
      let title = null;
      
      if (i === 0) {
        audioUrl = apiJson.result?.download?.url;
        title = apiJson.result?.title;
      } else if (i === 1) {
        audioUrl = apiJson.result?.mp3;
        title = apiJson.result?.title;
      } else {
        audioUrl = apiJson.result?.link || apiJson.result?.audio?.link;
        title = apiJson.result?.title;
      }
      
      if (audioUrl) return { url: audioUrl, title: title };
    } catch (e) {
      console.error(`API ${i+1} falló:`, e);
    }
  }
  
  return null;
}

async function getVideoUrl(videoUrl) {
  const apis = [
    `https://api.vreden.my.id/api/ytmp4?url=${videoUrl}`,
    `https://api.botcahx.biz.id/api/dowloader/yt?url=${videoUrl}&apikey=Admin`,
    `https://api.lolhuman.xyz/api/ytvideo?apikey=GataDios&url=${videoUrl}`
  ];
  
  for (let i = 0; i < apis.length; i++) {
    try {
      const apiResponse = await fetch(apis[i]);
      const apiJson = await apiResponse.json();
      
      let videoUrl = null;
      let title = null;
      
      if (i === 0) {
        videoUrl = apiJson.result?.download?.url;
        title = apiJson.result?.title;
      } else if (i === 1) {
        videoUrl = apiJson.result?.mp4;
        title = apiJson.result?.title;
      } else {
        videoUrl = apiJson.result?.link || apiJson.result?.video?.link;
        title = apiJson.result?.title;
      }
      
      if (videoUrl) return { url: videoUrl, title: title };
    } catch (e) {
      console.error(`API ${i+1} falló:`, e);
    }
  }
  
  return null;
}

const handler = async (m, { conn }) => {
  if (!global.db.data.chats[m.chat].playOptions) return
  if (!global.db.data.chats[m.chat].playOptions[m.sender]) return
  
  const userOption = global.db.data.chats[m.chat].playOptions[m.sender]
  
  
  if (Date.now() > userOption.timestamp) {
    delete global.db.data.chats[m.chat].playOptions[m.sender]
    return
  }
  
  if (!userOption.waitingResponse) return
  
  const response = m.text.trim()
  if (!/^[1-4]$/.test(response)) return
  
  const option = parseInt(response)
  const { url, title } = userOption
  
  
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
        await conn.reply(m.chat, '💙 Descargando audio virtual... ✨', m, rcanal)
        try {
          const audioResult = await getAudioUrl(url)
          if (!audioResult || !audioResult.url) throw new Error('⚠ El enlace de audio no se generó correctamente.')
          
          await conn.sendMessage(m.chat, { 
            audio: { url: audioResult.url }, 
            fileName: `${audioResult.title || title}.mp3`, 
            mimetype: 'audio/mpeg' 
          }, { quoted: m })
        } catch (e) {
          return conn.reply(m.chat, '💙 ¡Gomen nasai! No se pudo enviar el audio virtual. ✨', m, rcanal)
        }
        break
        
      case 2: // MP4
        await conn.reply(m.chat, '💙 Descargando video virtual... ✨', m, rcanal)
        try {
          const videoResult = await getVideoUrl(url)
          if (!videoResult || !videoResult.url) throw new Error('⚠ El enlace de video no se generó correctamente.')
          
          await conn.sendFile(m.chat, videoResult.url, (videoResult.title || title) + '.mp4', title, m)
        } catch (e) {
          return conn.reply(m.chat, '💫 ¡Gomen! No se pudo enviar el video virtual. ✨', m, rcanal)
        }
        break
        
      case 3: 
        await conn.reply(m.chat, '💙 Descargando audio como documento virtual... ✨', m, rcanal)
        try {
          const audioResult = await getAudioUrl(url)
          if (!audioResult || !audioResult.url) throw new Error('⚠ El enlace de audio no se generó correctamente.')
          
          await conn.sendMessage(m.chat, { 
            document: { url: audioResult.url }, 
            fileName: `${audioResult.title || title}.mp3`, 
            mimetype: 'audio/mpeg',
            caption: `💙 ${title} ✨`
          }, { quoted: m })
        } catch (e) {
          return conn.reply(m.chat, '💙 ¡Gomen! No se pudo enviar el documento de audio virtual. ✨', m, rcanal)
        }
        break
        
      case 4: 
        await conn.reply(m.chat, '💙 Descargando video como documento virtual... ✨', m, rcanal)
        try {
          const videoResult = await getVideoUrl(url)
          if (!videoResult || !videoResult.url) throw new Error('⚠ El enlace de video no se generó correctamente.')
          
          await conn.sendMessage(m.chat, { 
            document: { url: videoResult.url }, 
            fileName: `${videoResult.title || title}.mp4`, 
            mimetype: 'video/mp4',
            caption: `🎤💙 ${title} ✨`
          }, { quoted: m })
        } catch (e) {
          return conn.reply(m.chat, '💙 ¡Gomen! No se pudo enviar el documento de video virtual. ✨', m, rcanal)
        }
        break
    }
  } catch (error) {
    return conn.reply(m.chat, `💙 ¡Gomen! Ocurrió un error en el escenario virtual: ${error} ✨`, m, rcanal)
  }
}

handler.before = async function (m, { conn }) {
  return handler(m, { conn })
}

export default handler
