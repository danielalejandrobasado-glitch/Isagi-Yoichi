/* 
🎤💙 Codígo creado por Brauliovh3
https://github.com/Brauliovh3/HATSUNE-MIKU.git 
*/

import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix }) => {
    let who = m.mentionedJid.length > 0 ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender)
    let name = conn.getName(who)
    let name2 = conn.getName(m.sender)

    let str = m.mentionedJid.length > 0 || m.quoted 
        ? `\`${name2}\` está tomando café con \`${name || who}\` en el café virtual (≧▽≦) ☕💙` 
        : `\`${name2}\` está tomando café en el mundo virtual ٩(●ᴗ●)۶ ☕✨`
    
    if (m.isGroup) {
        let pp = 'https://files.catbox.moe/xdr9dh.mp4'
        let pp2 = 'https://files.catbox.moe/3bi7xt.mp4'
        let pp3 = 'https://files.catbox.moe/0u730a.mp4'
        let pp4 = 'https://files.catbox.moe/4vp1i7.mp4'
        let pp5 = 'https://files.catbox.moe/sqm5yl.mp4'
        let pp6 = 'https://files.catbox.moe/gxwq8a.mp4'
        let pp7 = 'https://files.catbox.moe/w1m9y9.mp4'
        let pp8 = 'https://files.catbox.moe/z1ory3.mp4'
       
        
        const videos = [pp, pp2, pp3, pp4, pp5, pp6, pp7, pp8]
        const video = videos[Math.floor(Math.random() * videos.length)]
        
        conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, ptt: true, mentions: [who] }, { quoted: m })
    }
}

handler.help = ['coffee']
handler.tags = ['anime']
handler.command = ['coffee', 'cafe', 'café']
handler.group = true

export default handler
