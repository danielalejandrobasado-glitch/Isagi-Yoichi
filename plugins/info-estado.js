import ws from 'ws'
let handler = async (m, { conn, usedPrefix, isRowner }) => {
    let _muptime
    let totalreg = Object.keys(global.db.data.users).length
    let totalchats = Object.keys(global.db.data.chats).length
    let pp = "https://i.pinimg.com/736x/7b/c6/95/7bc6955d19ce9fa6e562e634d85c912b.jpg"
    
    if (process.send) {
        process.send('uptime')
        _muptime = await new Promise(resolve => {
            process.once('message', resolve)
            setTimeout(resolve, 1000)
        }) * 1000
    }
    let muptime = clockString(_muptime)
    let users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])]
    const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)
    const groupsIn = chats.filter(([id]) => id.endsWith('@g.us')) 
    const totalUsers = users.length
    let old = performance.now()
    let neww = performance.now()
    let speed = neww - old
    const used = process.memoryUsage()
    let miku = `💙 \`\`\`Información - HatsuneMiku\`\`\` 💙\n\n`
    miku += `💙 ◜Creador◞ ⇢ (ㅎㅊDEPOOLㅊㅎ)\n`
    miku += `❗️ ◜Prefijo◞ ⇢ [ ${usedPrefix} ]\n`
    miku += `🌺꙰ ◜Versión◞ ⇢ ${vs}\n`
    miku += `🌻꙰ ◜Chats Privados◞ ⇢ ${chats.length - groupsIn.length}\n`
    miku += `💥 ◜Total De Chats◞ ⇢ ${chats.length}\n`
    miku += `👥️️ ◜Usuarios◞ ⇢ ${totalreg}\n`
    miku += `🔒 ◜Chats Privados◞ ⇢ ${chats.length - groupsIn.length}\n`
    miku += `📌 ◜Grupos◞ ⇢ ${groupsIn.length}\n`
    miku += `🕝 ◜Actividad◞ ⇢ ${muptime}\n`
    miku += `🚀 ◜Velocidad◞ ⇢ ${(speed * 1000).toFixed(0) / 1000}\n`
    miku += `🌱 ◜SubBots Activos◞ ⇢ ${totalUsers || '0'}`
   
    await conn.sendMessage(m.chat, {
        image: { url: pp },
        caption: miku, 
        mentions: [m.sender],
        contextInfo: {
            externalAdReply: {
                title: 'Estado del Bot',
                body: 'Hatsune Miku 🎶',
                thumbnailUrl: pp,
                sourceUrl: 'https://github.com/Brauliovh3',
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m })
}
handler.help = ['status']
handler.tags = ['info']
handler.command = ['estado', 'status', 'estate', 'state', 'stado', 'stats']
handler.register = true
export default handler
function clockString(ms) {
    let h = Math.floor(ms / 3600000)
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
