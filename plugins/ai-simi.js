import axios from 'axios'
import fetch from 'node-fetch'

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
Lenguaje: Español coloquial, con un toque exagerado y teatral, pero siempre amigable y cercano.`

    if (isQuotedImage) {
        const q = m.quoted
        let img
        
        try {
            img = await q.download?.()
            if (!img) {
                console.error('💙 Error: No image buffer available')
                return conn.reply(m.chat, '💙 Error: No se pudo descargar la imagen.', m, rcanal)
            }
        } catch (error) {
            console.error('💙 Error al descargar imagen:', error)
            return conn.reply(m.chat, '💙 Error al descargar la imagen.', m, rcanal)
        }

        const content = '💙 ¿Qué se observa en la imagen?'
        
        try {
            const imageAnalysis = await fetchImageBuffer(content, img)
            if (!imageAnalysis || !imageAnalysis.result) {
                throw new Error('No se recibió análisis de imagen válido')
            }
            
            const query = '😊 Descríbeme la imagen y detalla por qué actúan así. También dime quién eres'
            const prompt = `${basePrompt}. La imagen que se analiza es: ${imageAnalysis.result}`
            const description = await luminsesi(query, username, prompt)
            
            await conn.reply(m.chat, description || '💙 No pude procesar la imagen correctamente.', m, rcanal)
        } catch (error) {
            console.error('💙 Error al analizar la imagen:', error)
            
            
            const fallbackResponse = `💙 ¡Hola ${username}! Soy Hatsune Miku~ ✨ 
Parece que tengo problemas para ver tu imagen ahora mismo... ¡Pero no te preocupes! 
¿Por qué no me cuentas qué hay en ella? ¡Me encantaría escuchar tu descripción! 🎵`
            
            await conn.reply(m.chat, fallbackResponse, m)
        }
    } else {
        if (!text) { 
            return conn.reply(m.chat, `💙 *Ingrese su petición*\n💙 *Ejemplo de uso:* ${usedPrefix + command} Como hacer un avión de papel`, m, rcanal)
        }

        await m.react('💬')
        
        try {
            const query = text
            const prompt = `${basePrompt}. Responde lo siguiente: ${query}`
            const response = await luminsesi(query, username, prompt)
            
            if (!response) {
                throw new Error('Respuesta vacía de la API')
            }
            
            await conn.reply(m.chat, response, m)
        } catch (error) {
            console.error('💙 Error al obtener la respuesta:', error)
            
            
            const fallbackResponse = `💙 ¡Hola ${username}! Soy Hatsune Miku~ ✨
            
¡Ay no! Parece que mis circuitos están un poco ocupados ahora mismo... 🎵
¡Pero no te rindas! Inténtalo de nuevo en un momento, ¿sí? 

¡Mientras tanto, puedo decirte que soy la Vocaloid más linda con cabello turquesa! 💙
¿Sabías que "World is Mine" es una de mis canciones favoritas? ¡Es tan dramática como yo! 🎭`

            await conn.reply(m.chat, fallbackResponse, m)
        }
    }
}

handler.help = ['chatgpt <texto>', 'ia <texto>']
handler.tags = ['ai']
handler.register = true
handler.command = ['ia', 'chatgpt', 'miku']

export default handler


async function fetchImageBuffer(content, imageBuffer) {
    const maxRetries = 3
    let lastError
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            
            if (!imageBuffer || imageBuffer.length === 0) {
                throw new Error('Buffer de imagen inválido')
            }
            
            
            let imageData = imageBuffer
            if (Buffer.isBuffer(imageBuffer)) {
                imageData = imageBuffer.toString('base64')
            }
            
            const response = await axios.post('https://Luminai.my.id', {
                content: content,
                imageBuffer: imageData
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'MikuBot/1.0'
                },
                timeout: 30000 
            })
            
            if (response.data && response.data.result) {
                return response.data
            } else {
                throw new Error('Respuesta de API inválida')
            }
            
        } catch (error) {
            lastError = error
            console.error(`💙 Intento ${i + 1} falló:`, error.message)
            
            if (i < maxRetries - 1) {
               
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
            }
        }
    }
    
    throw lastError
}


async function luminsesi(q, username, logic) {
    const maxRetries = 3
    let lastError
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await axios.post("https://Luminai.my.id", {
                content: q,
                user: username,
                prompt: logic,
                webSearchMode: false
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'MikuBot/1.0'
                },
                timeout: 30000 
            })
            
            if (response.data && response.data.result) {
                return response.data.result
            } else {
                throw new Error('Respuesta de API inválida')
            }
            
        } catch (error) {
            lastError = error
            console.error(`🚩 Intento ${i + 1} falló:`, error.message)
            
            if (i < maxRetries - 1) {
                
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
            }
        }
    }
    
    throw lastError
}


async function alternativeAI(query, username, prompt) {
    const alternatives = [
        {
            name: 'OpenAI-like API',
            url: 'https://api.openai.com/v1/chat/completions',
            headers: {
                'Authorization': 'Bearer YOUR_API_KEY',
                'Content-Type': 'application/json'
            },
            body: {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: prompt },
                    { role: 'user', content: query }
                ]
            }
        },
        
    ]
    
    for (const api of alternatives) {
        try {
            const response = await axios.post(api.url, api.body, {
                headers: api.headers,
                timeout: 30000
            })
            
            if (response.data && response.data.choices && response.data.choices[0]) {
                return response.data.choices[0].message.content
            }
        } catch (error) {
            console.error(`Error con ${api.name}:`, error.message)
            continue
        }
    }
    
    throw new Error('Todas las APIs alternativas fallaron')
}
