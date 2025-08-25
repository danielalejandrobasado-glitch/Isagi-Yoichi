import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*


global.botNumber = '' 

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.owner = [
// <-- Número @s.whatsapp.net -->
  ['51988514570', '🎵 Brauliovh3 - Hatsune Miku Dev 🎵', true],
  ['51988514570', '(ㅎㅊDEPOOLㅊㅎ)', true],
  
// <-- Número @lid -->
  ['141807421759536', '(ㅎㅊDEPOOLㅊㅎ)', true]
];

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.mods = []
global.suittag = ['51988514570'] 
global.prems = []

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.libreria = 'Baileys'
global.baileys = 'V 6.7.17' 
global.vs = '2.2.5'
global.nameqr = '⚽ Isagi-Yoichi-MD ⚽'
global.namebot = '💙 Ｉｓａｇｉ Ｙｏｉｃｈｉ Ｂｏｔ 💙'
global.sessions = 'Sessions'
global.jadi = 'JadiBots' 
global.yukiJadibts = true

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.packname = '⚽🔥 𝙄𝙎𝘼𝙂𝙄 𝙔𝙊𝙄𝘾𝙃𝙄 𝘽𝙊𝙏 🔥⚽'
global.botname = '🄸🅂🄰🄶🄸 🅈🄾🄸🄲🄷🄸'
global.wm = '⚽◟Iѕαɠι Yσιcнι◞⚽'
global.author = '© (ᴮᴸᵁᴱ ᴸᴼᶜᴷ)'
global.dev = '© 🄿🄾🅆🄴🅁🄴🄳 (ᴮᴸᵁᴱ ᴸᴼᶜᴷ)'
global.textbot = '⚽ Isagi Yoichi, el devorador de sueños en Blue Lock ⚽'
global.etiqueta = '🔥(ᴮᴸᵁᴱ ᴸᴼᶜᴷ)🔥'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.moneda = '⚽ Bluecoins'
global.welcom1 = '💙 ¡Bienvenido al campo de Blue Lock! 💙 \n🔥 Aquí forjamos al mejor delantero del mundo 🔥 \n⚽ Edita este mensaje con setwelcome ⚽'
global.welcom2 = '💫 ¡El partido terminó! Gracias por jugar con nosotros 🌟 \n⚡ ¡Nos vemos en el próximo encuentro en Blue Lock! ⚡ \n🏆 Edita este mensaje con setbye 🏆'
global.banner = 'https://files.catbox.moe/nrkfzv.jpg'
global.avatar = 'https://files.catbox.moe/nrkfzv.jpg'
//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.gp1 = 'https://chat.whatsapp.com/FQ78boTUpJ7Ge3oEtn8pRE?mode=ac_t'
global.comunidad1 = 'https://chat.whatsapp.com/FQ78boTUpJ7Ge3oEtn8pRE?mode=ac_t'
global.channel = 'https://www.whatsapp.com/channel/0029VajYamSIHphMAl3ABi1o'
global.channel2 = 'https://www.whatsapp.com/channel/0029VajYamSIHphMAl3ABi1o'
global.md = 'https://github.com/Brauliovh3/HATSUNE-MIKU'
global.correo = 'brauliovh3@gmail.com'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.catalogo = fs.readFileSync('./src/catalogo.jpg');
global.estilo = { key: {  fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {}) }, message: { orderMessage: { itemCount : -999999, status: 1, surface : 1, message: packname, orderTitle: 'Bang', thumbnail: catalogo, sellerJid: '0@s.whatsapp.net'}}}
global.ch = {
ch1: '120363401404146384@newsletter',
}
global.multiplier = 60

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment   

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'settings.js'"))
  import(`${file}?update=${Date.now()}`)
})
