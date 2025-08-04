import { promises as fs } from 'fs'

const charactersFilePath = './src/database/characters.json'
const haremFilePath = './src/database/harem.json'

async function loadCharacters() {
    try {
        const data = await fs.readFile(charactersFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        throw new Error('🎤💙 No se pudo cargar el archivo de personajes virtuales del concierto ✨')
    }
}

async function loadHarem() {
    try {
        const data = await fs.readFile(haremFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        return []
    }
}

let handler = async (m, { conn, args }) => {
    try {
        const characters = await loadCharacters()
        const harem = await loadHarem()
        let userId

        if (m.quoted && m.quoted.sender) {
            userId = m.quoted.sender
        } else if (args[0] && args[0].startsWith('@')) {
            userId = args[0].replace('@', '') + '@s.whatsapp.net'
        } else {
            userId = m.sender
        }

        const userCharacters = characters.filter(character => character.user === userId)

        if (userCharacters.length === 0) {
            await conn.reply(m.chat, '🎤💙 No tienes personajes virtuales reclamados en tu colección del concierto mágico ✨🎵', m)
            return
        }

        const page = parseInt(args[1]) || 1
        const charactersPerPage = 50
        const totalCharacters = userCharacters.length
        const totalPages = Math.ceil(totalCharacters / charactersPerPage)
        const startIndex = (page - 1) * charactersPerPage
        const endIndex = Math.min(startIndex + charactersPerPage, totalCharacters)

        if (page < 1 || page > totalPages) {
            await conn.reply(m.chat, `🎤💙 Página no válida del concierto virtual. Hay un total de *${totalPages}* páginas en tu colección ✨🎵`, m)
            return
        }

        let message = `🎤💙 Personajes Virtuales Reclamados ✨\n`
        message += `🎵 Fanático: @${userId.split('@')[0]}\n`
        message += `💫 Personajes del Concierto: *(${totalCharacters}):*\n\n`

        for (let i = startIndex; i < endIndex; i++) {
            const character = userCharacters[i]
            message += `🌟 *${character.name}* (*${character.value}*)\n`
        }

        message += `\n🎤💙 _Página *${page}* de *${totalPages}* del mundo virtual de Miku_ ✨🎵`

        await conn.reply(m.chat, message, m, { mentions: [userId] })
    } catch (error) {
        await conn.reply(m.chat, `🎤💙 ¡Gomen! Error al cargar la colección virtual: ${error.message} ✨💫`, m)
    }
}

handler.help = ['harem [@usuario] [pagina]']
handler.tags = ['anime']
handler.command = ['harem', 'claims', 'waifus']
handler.group = true

export default handler
