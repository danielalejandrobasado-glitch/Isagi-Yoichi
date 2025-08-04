import { promises as fs } from 'fs'

const charactersFilePath = './src/database/characters.json'
const haremFilePath = './src/database/harem.json'

const cooldowns = {}

async function loadCharacters() {
    try {
        const data = await fs.readFile(charactersFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        throw new Error('💙 No se pudo cargar el archivo de personajes virtuales ✨')
    }
}

async function saveCharacters(characters) {
    try {
        await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2), 'utf-8')
    } catch (error) {
        throw new Error('🎵 No se pudo guardar el archivo de personajes virtuales 💫🎵')
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

async function saveHarem(harem) {
    try {
        await fs.writeFile(haremFilePath, JSON.stringify(harem, null, 2), 'utf-8')
    } catch (error) {
        throw new Error('🎶✨ No se pudo guardar el archivo de harem virtual ✨🎶')
    }
}

let handler = async (m, { conn }) => {
    const userId = m.sender
    const now = Date.now()

    if (cooldowns[userId] && now < cooldowns[userId]) {
        const remainingTime = Math.ceil((cooldowns[userId] - now) / 1000)
        const minutes = Math.floor(remainingTime / 60)
        const seconds = remainingTime % 60
        return await conn.reply(m.chat, `🎤💙 Debes esperar *${minutes} minutos y ${seconds} segundos* para hacer otro gacha virtual con *#rw* ✨`, m)
    }

    try {
        const characters = await loadCharacters()
        const randomCharacter = characters[Math.floor(Math.random() * characters.length)]
        const randomImage = randomCharacter.img[Math.floor(Math.random() * randomCharacter.img.length)]

        const harem = await loadHarem()
        const userEntry = harem.find(entry => entry.characterId === randomCharacter.id)
        const statusMessage = randomCharacter.user 
            ? `Reclamado por Fanático @${randomCharacter.user.split('@')[0]}` 
            : 'Libre en el Mundo Virtual'

        const message = `🎤💙 Nombre Virtual » *${randomCharacter.name}*
🎵 Género » *${randomCharacter.gender}*
✨ Valor Musical » *${randomCharacter.value}*
💫 Estado » ${statusMessage}
🌟 Origen » *${randomCharacter.source}*
🎶 ID Virtual: *${randomCharacter.id}*`

        const mentions = userEntry ? [userEntry.userId] : []
        await conn.sendFile(m.chat, randomImage, `${randomCharacter.name}.jpg`, message, m, { mentions })

        if (!randomCharacter.user) {
            await saveCharacters(characters)
        }

        cooldowns[userId] = now + 15 * 60 * 1000

    } catch (error) {
        await conn.reply(m.chat, `🎤💙 ¡Gomen! Error al cargar el personaje virtual: ${error.message} ✨`, m)
    }
}

handler.help = ['ver', 'rw', 'rollwaifu']
handler.tags = ['gacha']
handler.command = ['ver', 'rw', 'rollwaifu']
handler.group = true

export default handler
