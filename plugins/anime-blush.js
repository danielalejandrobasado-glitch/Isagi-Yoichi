/* 
🎤💙 Código creado por Brauliovh3 
✧ https://github.com/Brauliovh3/HATSUNE-MIKU.git 
💙 Hatsune Miku Bot - Virtual Concert Experience 🎵✨
*/

import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix }) => {
    let who = m.mentionedJid.length > 0 ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender)
    let name = conn.getName(who)
    let name2 = conn.getName(m.sender)

    let str = m.mentionedJid.length > 0 || m.quoted 
        ? `🎤💙 \`${name2}\` se sonrojó por \`${name || who}\` en el concierto virtual ✨😊🎵` 
        : `🎤💙 \`${name2}\` se sonrojó kawaii en el mundo virtual de Miku ✨😊💫`
    
    if (m.isGroup) {
        let pp = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1742850806611.mp4'
        let pp2 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1742850803110.mp4'
        let pp3 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1742850799870.mp4'
        let pp4 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1742850788425.mp4'
        let pp5 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1742850783279.mp4'
        let pp6 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1742850820693.mp4'
        let pp7 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1742850824451.mp4'
        let pp8 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1742850827494.mp4'
        let pp9 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1742850833266.mp4'
        let pp10 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1742850836360.mp4'
        let pp11 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1742850812113.mp4'
        let pp12 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1742850816932.mp4'
        let pp13 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1745596101873.mp4'
        let pp14 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1745596097358.mp4'
        let pp15 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1745596092857.mp4'
        
        const videos = [pp, pp2, pp3, pp4, pp5, pp6, pp7, pp8, pp9, pp10, pp11, pp12, pp13, pp14, pp15]
        const video = videos[Math.floor(Math.random() * videos.length)]
        
        conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, ptt: true, mentions: [who] }, { quoted: m })
    }
}

handler.help = ['blush']
handler.tags = ['anime']
handler.command = ['blush', 'sonrojarse']
handler.group = true

export default handler