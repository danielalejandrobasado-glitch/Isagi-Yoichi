import { useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, Browsers } from "@whiskeysockets/baileys"
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from "pino"
import { makeWASocket } from "../lib/simple.js"

const rtxQR = `💙━━━✦ MIKU SUB-BOT ✦━━━💙

🎶 ¡Conexión QR modo Sub-Bot! 🎶

💫 Escanea este QR desde otro dispositivo para convertirte en mi Sub-Bot temporal:

1️⃣ Abre WhatsApp Web  
2️⃣ Toca los 3 puntos arriba  
3️⃣ Selecciona "Dispositivos vinculados"  
4️⃣ Escanea este código QR

⏰ ¡Este código expira en 45 segundos!
`

const rtxCode = `💙━━━✦ MIKU SUB-BOT ✦━━━💙

🎶 ¡Conexión por código modo Sub-Bot! 🎶

💫 Usa este código para vincularte como Sub-Bot:

1️⃣ Abre WhatsApp  
2️⃣ Toca los 3 puntos arriba  
3️⃣ Selecciona "Dispositivos vinculados"  
4️⃣ Toca "Vincular un dispositivo"
5️⃣ Selecciona "Vincular con número de teléfono"
6️⃣ Ingresa el código que recibirás abajo

⚠️ Recomendación: No uses tu cuenta principal.  
`

export async function mikuJadiBot(options) {
  let { pathMikuJadiBot, m, conn, args = [] } = options

  // Modo código si el primer argumento es 'code' o '--code'
  const isCodeMode = args[0] && /(--code|code)/i.test(args[0])
  if (!fs.existsSync(pathMikuJadiBot)) fs.mkdirSync(pathMikuJadiBot, { recursive: true })

  // Carga/crea credenciales si se pasan por args[1] (opcional)
  const pathCreds = path.join(pathMikuJadiBot, "creds.json")
  try {
    if (args[1]) {
      const credData = JSON.parse(Buffer.from(args[1], "base64").toString("utf-8"))
      fs.writeFileSync(pathCreds, JSON.stringify(credData, null, 2))
    }
  } catch (error) {
    if (conn && m) conn.reply(m.chat, "❌ Error en las credenciales, usa el comando correctamente.", m)
    return
  }

  const { state, saveCreds } = await useMultiFileAuthState(pathMikuJadiBot)
  const { version } = await fetchLatestBaileysVersion()
  const msgRetryCache = new NodeCache()
  const connectionOptions = {
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }))
    },
    msgRetryCache,
    browser: Browsers.macOS("Desktop"),
    version,
    generateHighQualityLinkPreview: true,
    syncFullHistory: false,
    markOnlineOnConnect: true
  }
  let sock = makeWASocket(connectionOptions)

  // Evento de conexión para QR/código
  sock.ev.on("connection.update", async (update) => {
    const { connection, qr } = update

    // QR
    if (qr && !isCodeMode && m && conn) {
      const qrBuffer = await qrcode.toBuffer(qr, { scale: 8, margin: 2, color: { dark: "#39C5BB", light: "#FFFFFF" } })
      await conn.sendMessage(m.chat, { image: qrBuffer, caption: rtxQR }, { quoted: m })
    }

    // Pairing code
    if (qr && isCodeMode && m && conn) {
      // PRIMERO: instrucciones
      await conn.sendMessage(m.chat, { text: rtxCode }, { quoted: m })
      // SEGUNDO: el código
      try {
        let pairingCode = await sock.requestPairingCode(m.sender.split("@")[0])
        if (pairingCode) {
          pairingCode = pairingCode.toString().replace(/\D/g, "")
          let formattedCode = pairingCode.match(/.{1,4}/g)?.join("-") || pairingCode
          await conn.sendMessage(m.chat, {
            text: `💙 *CÓDIGO DE VINCULACIÓN:*\n\n\`\`\`${formattedCode}\`\`\`\n\n⏰ ¡Este código expira pronto!`
          }, { quoted: m })
        }
      } catch (e) {
        await conn.sendMessage(m.chat, { text: "❌ No se pudo generar el código. Intenta nuevamente." }, { quoted: m })
      }
    }

    if (connection === "open" && m && conn) {
      await conn.sendMessage(m.chat, { text: "💙 ¡Sub-Bot Miku conectado exitosamente!" }, { quoted: m })
    }
  })

  sock.ev.on('creds.update', saveCreds)
}
