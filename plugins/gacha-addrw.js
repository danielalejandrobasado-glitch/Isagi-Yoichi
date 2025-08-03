/* 🎤💙 Código creado por Brauliovh3 
✧ https://github.com/Brauliovh3/HATSUNE-MIKU.git 
💙 Hatsune Miku Bot - Virtual Concert Experience 🎵✨ */

import fetch from 'node-fetch'

const handler = async (m, { text, usedPrefix, command, conn }) => {
    const args = text.split(',').map(arg => arg.trim())

    if (args.length < 7) {
        return m.reply(`🎤💙 ¡Ara ara! Por favor proporciona toda la información del personaje virtual.\n🎵 Ejemplo: ${usedPrefix}${command} <Nombre del personaje>, <Género>, <Valor>, <Origen>, <Enlace de imagen 1>, <Enlace de imagen 2>, <Enlace de imagen 3>\n\n💫 Nota: Los enlaces deben estar en catbox.moe o qu.ax (configurado como permanente). ✨`)
    }

    const [name, gender, value, source, img1, img2, img3] = args

    if (!img1.startsWith('http') || !img2.startsWith('http') || !img3.startsWith('http')) {
        return m.reply('🎵💙 ¡Por favor, proporciona enlaces válidos para las imágenes del personaje virtual! ✨')
    }

    const characterData = {
        id: Date.now().toString(),
        name,
        gender,
        value,
        source,
        img: [img1, img2, img3],
        vid: [],
        user: null,
        status: "Libre",
        votes: 0
    }

    const tagNumber = '51988514570@s.whatsapp.net'

    const jsonMessage = `🎤💙 Nuevo personaje virtual añadido al escenario 💙🎤\n\n\`\`\`${JSON.stringify(characterData, null, 2)}\`\`\``
    await conn.sendMessage(tagNumber, { text: jsonMessage })

    m.reply(`💙 El personaje virtual *"${name}"* ha sido enviado al staff de Miku para su posterior adición al concierto! 💙🎤`)
}

handler.command = ['addcharacter', 'addrw']

export default handler