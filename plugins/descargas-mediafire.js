import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    throw m.reply(`${emoji} Por favor, ingresa un link de mediafire.`);
  }

  
  if (!isValidMediaFireUrl(text)) {
    return m.reply(`❌ El enlace proporcionado no es válido. Por favor, ingresa un enlace de MediaFire válido.`);
  }

  conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

  try {

    const downloadData = await getMediaFireDownload(text);
    
    if (!downloadData) {
      throw new Error('No se pudo obtener el enlace de descarga desde ninguna API');
    }

    const { link, name, size, mime } = downloadData;

    
    if (!link || !isValidUrl(link)) {
      throw new Error('El enlace de descarga obtenido no es válido');
    }

    console.log(`Descargando: ${name} (${size})`);


    await conn.sendFile(
      m.chat, 
      link, 
      name || 'mediafire_file', 
      `乂  ¡MEDIAFIRE - DESCARGAS!  乂\n\n✩ Nombre: ${name || 'Desconocido'}\n✩ Peso: ${size || 'Desconocido'}\n✩ MimeType: ${mime || 'Desconocido'}\n> ${dev}`, 
      m
    );
    
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (error) {
    console.error('Error en MediaFire downloader:', error);
    
    
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    
   
    const errorMsg = getErrorMessage(error.message);
    return m.reply(`❌ ${errorMsg}`);
  }
};


function isValidMediaFireUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('mediafire.com') && 
           (url.includes('/file/') || url.includes('/download/'));
  } catch {
    return false;
  }
}


function isValidUrl(string) {
  try {
    new URL(string);
    return string.startsWith('http://') || string.startsWith('https://');
  } catch {
    return false;
  }
}


async function getMediaFireDownload(url) {
  const apis = [
    {
      name: 'API Ryzen',
      url: `https://api.ryzendesu.vip/api/downloader/mediafire?url=${encodeURIComponent(url)}`,
      parser: (data) => ({
        link: data?.url,
        name: data?.filename,
        size: data?.filesizeH,
        mime: data?.ext
      })
    },
    {
      name: 'API VihangaYT',
      url: `https://vihangayt.me/download/mediafire?url=${encodeURIComponent(url)}`,
      parser: (data) => ({
        link: data?.data?.link || data?.result?.link,
        name: data?.data?.name || data?.result?.filename,
        size: data?.data?.size || data?.result?.filesizeH,
        mime: data?.data?.type || data?.result?.ext
      })
    },
    {
      name: 'API BotCahx',
      url: `https://api.botcahx.biz.id/api/dowloader/mediafire?url=${encodeURIComponent(url)}&apikey=Admin`,
      parser: (data) => ({
        link: data?.result?.link,
        name: data?.result?.filename,
        size: data?.result?.filesizeH,
        mime: data?.result?.ext
      })
    },
    {
      name: 'API LolHuman',
      url: `https://api.lolhuman.xyz/api/mediafire?apikey=GataDios&url=${encodeURIComponent(url)}`,
      parser: (data) => ({
        link: data?.result?.link,
        name: data?.result?.filename,
        size: data?.result?.filesizeH,
        mime: data?.result?.ext
      })
    },
    {
      name: 'API Agatz (Original)',
      url: `https://api.agatz.xyz/api/mediafire?url=${encodeURIComponent(url)}`,
      parser: (data) => ({
        link: data?.data?.[0]?.link,
        name: data?.data?.[0]?.nama,
        size: data?.data?.[0]?.size,
        mime: data?.data?.[0]?.mime
      })
    }
  ];

  for (let i = 0; i < apis.length; i++) {
    try {
      console.log(`Probando ${apis[i].name}: ${apis[i].url}`);
      
      const response = await fetch(apis[i].url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 15000
      });

      if (!response.ok) {
        console.log(`${apis[i].name} responded with status: ${response.status}`);
        continue;
      }

      const data = await response.json();
      console.log(`${apis[i].name} response:`, JSON.stringify(data, null, 2));

      const parsedData = apis[i].parser(data);
      
      if (parsedData.link && isValidUrl(parsedData.link)) {
        console.log(`✓ ${apis[i].name} devolvió datos válidos`);
        return {
          link: parsedData.link,
          name: parsedData.name || 'archivo_mediafire',
          size: parsedData.size || 'Tamaño desconocido',
          mime: parsedData.mime || 'application/octet-stream'
        };
      } else {
        console.log(`✗ ${apis[i].name} no devolvió enlace válido`);
      }

    } catch (error) {
      console.error(`✗ ${apis[i].name} falló:`, error.message);
    }
  }

  return null;
}


function getErrorMessage(errorMsg) {
  if (errorMsg.includes('ENOTFOUND') || errorMsg.includes('fetch failed')) {
    return 'Error de conexión con los servidores. Inténtalo de nuevo más tarde.';
  }
  if (errorMsg.includes('timeout')) {
    return 'La descarga tardó demasiado tiempo. El archivo puede ser muy grande.';
  }
  if (errorMsg.includes('invalid') || errorMsg.includes('válido')) {
    return 'El enlace de MediaFire no es válido o el archivo no está disponible.';
  }
  if (errorMsg.includes('not found') || errorMsg.includes('404')) {
    return 'El archivo no fue encontrado. Verifica que el enlace sea correcto.';
  }
  return `Error al procesar la descarga: ${errorMsg}`;
}


handler.help = ['mediafire'];
handler.tags = ['descargas'];
handler.command = ['mf', 'mediafire'];
handler.coin = 10;
handler.register = true;
handler.group = true;

export default handler;
