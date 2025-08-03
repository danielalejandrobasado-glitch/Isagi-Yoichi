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
        ? `🎤💙 \`${name2}\` le hizo una cara traviesa a \`${name || who}\` en el concierto virtual ✨😜🎵` 
        : `🎤💙 \`${name2}\` está siendo travies@ en el mundo virtual de Miku ✨😜💫`
    
    if (m.isGroup) {
        let pp = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1742790736580.mp4'
        let pp2 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1742790732658.mp4'
        let pp3 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1742790771185.mp4'
        let pp4 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1742790767541.mp4'
        let pp5 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1742790764155.mp4'
        let pp6 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1742790752990.mp4'
        let pp7 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1742790742850.mp4'
        let pp8 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1742790794852.mp4'
        let pp9 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1742790790619.mp4'
        let pp10 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1742790785503.mp4'
        let pp11 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1742790781953.mp4'
        let pp12 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1742790775403.mp4'
        let pp13 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1745595800133.mp4'
        let pp14 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1745595794273.mp4'
        let pp15 = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1745595797089.mp4'
        
        const videos = [pp, pp2, pp3, pp4, pp5, pp6, pp7, pp8, pp9, pp10, pp11, pp12, pp13, pp14, pp15]
        const video = videos[Math.floor(Math.random() * videos.length)]
        
        conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, ptt: true, mentions: [who] }, { quoted: m })
    }
}

handler.help = ['bleh']
handler.tags = ['anime']
handler.command = ['bleh', 'lengua']
handler.group = true

export default handler