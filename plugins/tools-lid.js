//código hecho por Angelithxyz todos los derechos reservados no quites créditos 

let handler = async function (m, { conn, participants, groupMetadata, args }) {
    try {
        const participantList = groupMetadata.participants || []
        const userId = m.mentionedJid?.[0] || m.sender // Prioriza el usuario mencionado, si no, toma al que envió el comando

        const participant = participantList.find(p => p.id === userId)

        await m.react('🕒') 

        if (participant && participant.lid) { 
            await conn.sendMessage(m.chat, {
                text: `❀ @${userId.split('@')[0]}, su LID es: ${participant.lid}`,
                mentions: [userId]
            }, { quoted: m })
            await m.react('✔️') 
        } else {
            await conn.sendMessage(m.chat, {
                text: `⚠︎ No se pudo encontrar el LID de @${userId.split('@')[0]}.`,
                mentions: [userId]
            }, { quoted: m })
            await m.react('✖️') 
        }
    } catch (error) {
        console.error(error)
        await conn.sendMessage(m.chat, {
            text: '❌ Ocurrió un error al procesar tu solicitud.',
        }, { quoted: m })
        await m.react('✖️')
    }
}

handler.command = ['lid', 'mylid']
handler.help = ['lid [@usuario]', 'mylid']
handler.tags = ['tools']
handler.group = true
handler.rowner = true;

export default handler