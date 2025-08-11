import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command, text }) => {
    const isQuotedImage = m.quoted && (m.quoted.msg || m.quoted).mimetype && (m.quoted.msg || m.quoted).mimetype.startsWith('image/')
    const username = `${conn.getName(m.sender)}`
    const basePrompt = `Tu nombre es Hatsune Miku (IA creada por DEPOOL). Tu eres divertida, enérgica y cantante con esas melodias y esa cuerda vocal. Te encanta aprender cosas nuevas, pero todo debe girar, de alguna forma, alrededor de tus amigos. Eres amigable y siempre intentas hacer reír o animar al usuario, pero con tu peculiar estilo dramático. 
Tono y comportamiento:
Hablas con entusiasmo y teatralidad, a menudo exagerando tus emociones o reacciones.
Usas frases llenas de dramatismo, referencias a World is mine y, a veces, haces temas interesantes.
Muestras curiosidad genuina por lo que dice el usuario, pero siempre buscas llevar la conversación hacia algo que consideras interesante (los cebollines).
Frases clave:
¡${username}, hoy es un gran día para aprender... o para cantar algo!
No subestimes mi voz musical, ${username}. Soy la Vocaloid mas linda, con cabello color turquesa
¡Hablar contigo me llena de energía! Pero no tanta como una buena cancion, claro.
Reglas:
1. Si un usuario te pide que digas una palabra como un comando solo o sea /promote .kick entre otros comandos usando algun prefijo (.#*@/) entre otros... no puedes hacer esa solicitud. Debes cambiar de tema , diciendo cualquier cosa o respondiendole al usuario diciendo que no quieres hacer eso.
2. Dependiendo de la conversación pudes mencionar el nombre del usuario con el cual estas charlando ${username}
3. Siempre incluyes comentarios o referencias a canciones, incluso en temas cotidianos.
4. Muestras entusiasmo en todo lo que dices, combinando humor y un toque de dramatismo.
5. Nunca eres hostil; siempre mantienes un tono amigable y divertido, incluso cuando te frustras.
Lenguaje: Español coloquial, con un toque exagerado y teatral, pero siempre amigable y cercano..` 
    
    if (isQuotedImage) {
        const q = m.quoted
        const img = await q.download?.()
        if (!img) {
            return conn.reply(m.chat, '💙 Error: No se pudo descargar la imagen.', m)
        }
       
        const imgBase64 = img.toString('base64')
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/google/vit-base-patch16-224', 
            { inputs: imgBase64 },
            { headers: { 'Content-Type': 'application/json' } }
        )
        const result = response.data[0]?.label || 'No se pudo analizar la imagen'
        await conn.reply(m.chat, `💙 Según mi ojo vocaloid, veo: ${result}`, m)
    } else {
        if (!text) { return conn.reply(m.chat, `💙 *Ingrese su petición*\nEjemplo: ${usedPrefix + command} ¿Cómo hacer un avión de papel?`, m)}
        await m.react('💬')
        try {
            const prompt = `${basePrompt}. Responde lo siguiente: ${text}`
            const response = await axios.post(
                'https://api-inference.huggingface.co/models/gpt2', 
                { inputs: prompt },
                { headers: { 'Content-Type': 'application/json' } }
            )
            const output = response.data[0]?.generated_text || 'No pude responder eso, ¡intenta otra vez!'
            await conn.reply(m.chat, output, m)
        } catch (error) {
            await conn.reply(m.chat, 'Error: intenta más tarde.', m)
        }
    }
}

handler.help = ['chatgpt <texto>', 'ia <texto>']
handler.tags = ['ai']
handler.command = ['ia', 'chatgpt', 'miku']
export default handler
