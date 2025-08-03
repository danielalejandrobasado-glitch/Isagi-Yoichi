import { promises as fs } from 'fs';

const charactersFilePath = './src/database/characters.json';
const haremFilePath = './src/database/harem.json';

async function loadCharacters() {
    try {
        const data = await fs.readFile(charactersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error('🎤💙 No se pudo cargar el archivo de personajes virtuales ✨');
    }
}

async function saveCharacters(characters) {
    try {
        await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2));
    } catch (error) {
        throw new Error('🎵💫 No se pudo guardar el archivo de personajes virtuales 💫🎵');
    }
}

async function loadHarem() {
    try {
        const data = await fs.readFile(haremFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function saveHarem(harem) {
    try {
        await fs.writeFile(haremFilePath, JSON.stringify(harem, null, 2));
    } catch (error) {
        throw new Error('💙 No se pudo guardar el archivo de harem virtual ✨🌟');
    }
}

let cooldowns = new Map();
let characterVotes = new Map();

let handler = async (m, { conn, args }) => {
    try {
        const userId = m.sender;
        const cooldownTime = 1 * 60 * 60 * 1000;

        if (cooldowns.has(userId)) {
            const expirationTime = cooldowns.get(userId) + cooldownTime;
            const now = Date.now();
            if (now < expirationTime) {
                const timeLeft = expirationTime - now;
                const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
                const seconds = Math.floor((timeLeft / 1000) % 60);
                await conn.reply(m.chat, `🎤💙 Debes esperar *${Math.floor(minutes)} minutos ${seconds} segundos* para usar *#vote* virtual de nuevo ✨`, m);
                return;
            }
        }

        const characters = await loadCharacters();
        const characterName = args.join(' ');

        if (!characterName) {
            await conn.reply(m.chat, '🎵💫 Debes especificar un personaje virtual para votarlo en el concierto 💫🎵', m);
            return;
        }

        const originalCharacterName = characterName;
        const character = characters.find(c => c.name.toLowerCase() === originalCharacterName.toLowerCase());

        if (!character) {
            await conn.reply(m.chat, '🎶✨ Personaje virtual no encontrado. Asegúrate de que el nombre esté en el formato correcto del mundo Vocaloid ✨🎶', m);
            return;
        }

        if (characterVotes.has(originalCharacterName) && Date.now() < characterVotes.get(originalCharacterName)) {
            const expirationTime = characterVotes.get(originalCharacterName);
            const timeLeft = expirationTime - Date.now();
            const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
            const seconds = Math.floor((timeLeft / 1000) % 60);
            await conn.reply(m.chat, `🎤💙 El personaje virtual *${originalCharacterName}* ya ha sido votado recientemente. Debes esperar *${Math.floor(minutes)} minutos ${seconds} segundos* para volver a votar en el concierto ✨`, m);
            return;
        }

        const incrementValue = Math.floor(Math.random() * 10) + 1;
        character.value = String(Number(character.value) + incrementValue);
        character.votes += 1;
        await saveCharacters(characters);

        const harem = await loadHarem();
        const userEntry = harem.find(entry => entry.userId === userId && entry.characterId === character.id);

        if (!userEntry) {
            harem.push({
                userId: userId,
                characterId: character.id,
                lastVoteTime: Date.now(),
                voteCooldown: Date.now() + cooldownTime
            });
        } else {
            userEntry.lastVoteTime = Date.now();
            userEntry.voteCooldown = Date.now() + cooldownTime;
        }
        await saveHarem(harem);

        cooldowns.set(userId, Date.now());
        characterVotes.set(originalCharacterName, Date.now() + cooldownTime);

        await conn.reply(m.chat, `💙 Votaste por el personaje *${originalCharacterName}*\n> Su nuevo valor es *${character.value}* (incrementado en *${incrementValue}*)\n> Total de votos: *${character.votes}*`, m);
    } catch (e) {
        await conn.reply(m.chat, `✘ Error al actualizar el valor: ${e.message}`, m);
    }
};

handler.help = ['vote <nombre>'];
handler.tags = ['anime'];
handler.command = ['vote', 'votar'];
handler.group = true;
handler.register = true;

export default handler;
