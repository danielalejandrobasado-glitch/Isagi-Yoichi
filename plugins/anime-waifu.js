import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {
try {
await m.react(emojis)
conn.reply(m.chat, `⚽️ Buscando una hermosa waifu ¡Espera un momentito! ⚽️`, m, rcanal)
let res = await fetch('https://api.waifu.pics/sfw/waifu')
if (!res.ok) return
let json = await res.json()
if (!json.url) return 
await conn.sendFile(m.chat, json.url, 'thumbnail.jpg', `⚽️ ¡Aquí tienes tu hermosa waifu! ¿No es kawaii? (◕‿◕)♡ ⚽️`, m)
} catch {
}}
handler.help = ['waifu']
handler.tags = ['anime']
handler.command = ['waifu']
handler.group = true

export default handler
