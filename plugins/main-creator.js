//código hecho por angelithoxyz By Ryūsei Club 

// no quites créditos todos los derechos reservados 


import PhoneNumber from 'awesome-phonenumber'

let handler = async (m, { conn }) => {
  m.react('⚙️')

  let who = m.mentionedJid && m.mentionedJid[0] 
    ? m.mentionedJid[0] 
    : m.fromMe 
      ? conn.user.jid 
      : m.sender

  let biografiaCreador = await conn.fetchStatus('573244642273@s.whatsapp.net').catch(_ => 'Sin Biografía')
  let biografiaColaborador = await conn.fetchStatus('51901930696@s.whatsapp.net').catch(_ => 'Sin Biografía')
  let biografiaBot = await conn.fetchStatus(`${conn.user.jid.split('@')[0]}@s.whatsapp.net`).catch(_ => 'Sin Biografía')

  let bioCreador = biografiaCreador.status?.toString() || 'Sin Biografía'
  let bioColaborador = biografiaColaborador.status?.toString() || 'Sin Biografía'
  let bioBot = biografiaBot.status?.toString() || 'Sin Biografía'

  await sendContactArray(conn, m.chat, [
    
    [
      `573244642273`, 
      `💙 Propietario / Creador`, 
      `Made with By Ryūsei Club`, 
      `💠 CEO Oficial`, 
      `ryuseiclubxyz@gmail.com`, 
      `🌌 Ryūsei Club`, 
      `https://github.com/Angelithoxz`, 
      bioCreador
    ],
    
    [
      `51901930696`, 
      `🤝 Colaborador`, 
      `Made with By Ryūsei Club`, 
      `🔧 Support / Staff`, 
      `angelithoxyz@gmail.com`, 
      `🌌 Ryūsei Club`, 
      `https://github.com/Angelithoxz`, 
      bioColaborador
    ],
    
    [
      `${conn.user.jid.split('@')[0]}`, 
      `🤖 Bot Oficial`, 
      `💙 Isagi Yoichi Bot 💙`, 
      `📵 No hacer spam`, 
      `ryuseiclubxyz@gmail.com`, 
      `🌌 Ryūsei Club`, 
      `https://github.com/Angelithoxz`, 
      bioBot
    ]
  ], m)
}

handler.help = ["creador","owner"]
handler.tags = ["info"]
handler.command = ['owner','creador']
export default handler

async function sendContactArray(conn, jid, data, quoted, options) {
  if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data]
  let contacts = []
  for (let [number, name, isi, isi1, isi2, isi3, isi4, isi5] of data) {
    number = number.replace(/[^0-9]/g, '')
    let vcard = `
BEGIN:VCARD
VERSION:3.0
N:Sy;Bot;;;
FN:${name.replace(/\n/g, '\\n')}
item.ORG:${isi}
item1.TEL;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}
item1.X-ABLabel:${isi1}
item2.EMAIL;type=INTERNET:${isi2}
item2.X-ABLabel:📧 Email
item3.ADR:;;${isi3};;;;
item3.X-ABADR:ac
item3.X-ABLabel:🏷 Region
item4.URL:${isi4}
item4.X-ABLabel:Website
item5.X-ABLabel:${isi5}
END:VCARD`.trim()
    contacts.push({ vcard, displayName: name })
  }
  return await conn.sendMessage(jid, {
    contacts: {
      displayName: (contacts.length > 1 ? `Ryūsei Club Contacts` : contacts[0].displayName) || null,
      contacts,
    }
  }, {
    quoted,
    ...options
  })
}