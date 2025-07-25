import { sticker } from '../lib/sticker.js'
import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import { webp2png } from '../lib/webp2mp4.js'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let stiker = false
  
  try {
    
    const mikuDir = './miku/tmp'
    fs.mkdirSync(mikuDir, { recursive: true })
    
   
    try {
      const testFile = path.join(mikuDir, 'test.txt')
      fs.writeFileSync(testFile, 'test')
      fs.unlinkSync(testFile)
      console.log('Directorio temporal verificado y con permisos correctos')
    } catch (e) {
      console.error('Error de permisos en el directorio temporal:', e)
      return m.reply('💙 Error interno: Problema con permisos de directorios. Contacta al administrador.')
    }

    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    
    if (/webp|image|video/g.test(mime)) {
      if (/video/g.test(mime)) {
        if ((q.msg || q).seconds > 8) {
          return m.reply(`💙 *¡El video no puede durar mas de 8 segundos!*`)
        }
      }
      
      let img = await q.download?.()
      if (!img) {
        return m.reply(`💙 La conversión ha fallado, intenta enviar primero imagen/video/gif y luego responde con el comando.`)
      }
      
      let out
      try {
        
        stiker = await sticker(img, false, global.packsticker || 'Hatsune-Miku', global.author || '@bot')
      } catch (e) {
        console.error('Error en la primera fase de creación del sticker:', e)
      } finally {
        if (!stiker) {
          try {
            if (/webp/g.test(mime)) {
              out = await webp2png(img)
            } else if (/image/g.test(mime)) {
              out = await uploadImage(img)
            } else if (/video/g.test(mime)) {
              out = await uploadFile(img)
            }
            
            if (typeof out !== 'string') {
              out = await uploadImage(img)
            }
            
            stiker = await sticker(false, out, global.packsticker || 'Hatsune-Miku', global.author || '@bot')
          } catch (e) {
            console.error('Error en la segunda fase de creación del sticker:', e)
          }
        }
      }
    } else if (args[0]) {
      if (isUrl(args[0])) {
        try {
          stiker = await sticker(false, args[0], global.packsticker || 'Hatsune-Miku', global.author || '@bot')
        } catch (e) {
          console.error('Error en la creación del sticker desde URL:', e)
        }
      } else {
        return m.reply(`💫 El url es incorrecto`)
      }
    }
  } catch (e) {
    console.error('Error principal en el manejador de stickers:', e)
  } finally {
    if (stiker) {
      try {
        
        const tempStickerPath = path.join(mikuDir, `sticker-${Date.now()}.webp`)
        fs.writeFileSync(tempStickerPath, stiker)
        
       
        await conn.sendFile(m.chat, tempStickerPath, 'sticker.webp', '', m, true, { 
          contextInfo: { 
            'forwardingScore': 200, 
            'isForwarded': false, 
            externalAdReply: { 
              showAdAttribution: false, 
              title: global.packname || 'Bot', 
              body: `💙Hatsune-Miku💙`, 
              mediaType: 2, 
              sourceUrl: global.redes || '', 
              thumbnail: global.icons || null
            }
          }
        })
        
        
        fs.unlinkSync(tempStickerPath)
      } catch (sendErr) {
        console.error('Error al enviar el sticker:', sendErr)
        return m.reply('💙 *Ocurrió un error al enviar el sticker.*')
      }
    } else {
      return m.reply('💙 *La conversión ha fallado, intenta enviar primero imagen/video/gif y luego responde con el comando.*')
    }
  }
}

handler.help = ['stiker <img>', 'sticker <url>']
handler.tags = ['sticker']
handler.register = true
handler.command = ['s', 'sticker', 'stiker']

export default handler

const isUrl = (text) => {
  return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))
}
