import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

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
      throw new Error('No se pudo obtener el enlace de descarga');
    }

    const { link, name, size, mime } = downloadData;

    
    if (!link || !isValidUrl(link)) {
      throw new Error('El enlace de descarga obtenido no es válido');
    }

    console.log(`Descargando: ${name} (${size})`);

 
    const cleanFileName = cleanFileName(name);

 
    await conn.sendFile(
      m.chat, 
      link, 
      cleanFileName, 
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


function cleanFileName(filename) {
  if (!filename) return 'mediafire_file';
  return filename.replace(/[<>:"/\\|?*]/g, '_').trim();
}


function isValidMediaFireUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('mediafire.com') && 
           (url.includes('/file/') || url.includes('/download/') || url.includes('www.mediafire.com'));
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

async function parseMediaFireDirect(url) {
  try {
    console.log('🔍 Parseando MediaFire directamente...');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      follow: 5,
      timeout: 15000
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    
    let downloadLink = null;
    let fileName = null;
    let fileSize = null;

    
    downloadLink = $('#downloadButton').attr('href');
    

    if (!downloadLink) {
      downloadLink = $('.download_link').attr('href');
    }

   
    if (!downloadLink) {
      $('a').each((i, elem) => {
        const href = $(elem).attr('href');
        if (href && (href.includes('download') || href.includes('http')) && href !== url) {
          downloadLink = href;
          return false; 
        }
      });
    }

    
    if (!downloadLink) {
      const scripts = $('script').html() || '';
      const downloadMatches = scripts.match(/href=['"]([^'"]*download[^'"]*)['"]/i);
      if (downloadMatches) {
        downloadLink = downloadMatches[1];
      }
    }

   
    fileName = $('.filename').first().text() || 
               $('.dl-btn-label').first().text() ||
               $('[title*="filename"]').first().text() ||
               $('h1').first().text() ||
               'archivo_mediafire';

    fileSize = $('.details li').first().text() ||
               $('.filesize').first().text() ||
               'Tamaño desconocido';

    console.log('Parser directo encontró:', {
      downloadLink: downloadLink ? downloadLink.substring(0, 50) + '...' : null,
      fileName,
      fileSize
    });

    if (downloadLink && isValidUrl(downloadLink)) {
      return {
        link: downloadLink,
        name: fileName,
        size: fileSize,
        mime: getMimeFromFileName(fileName)
      };
    }

    return null;
  } catch (error) {
    console.error('Error en parser directo:', error.message);
    return null;
  }
}


function getMimeFromFileName(filename) {
  if (!filename) return 'application/octet-stream';
  
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimeTypes = {
    'mp4': 'video/mp4',
    'mp3': 'audio/mpeg',
    'pdf': 'application/pdf',
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    'apk': 'application/vnd.android.package-archive',
    'jpg': 'image/jpeg',
    'png': 'image/png',
    'txt': 'text/plain',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'exe': 'application/x-msdownload'
  };

  return mimeTypes[ext] || 'application/octet-stream';
}


async function getMediaFireDownload(url) {

  console.log('🎯 Intentando parser directo...');
  const directResult = await parseMediaFireDirect(url);
  if (directResult) {
    console.log('✅ Parser directo exitoso');
    return directResult;
  }


  const apis = [
    {
      name: 'API NeoxR',
      url: `https://api.neoxr.eu/api/mediafire?url=${encodeURIComponent(url)}&apikey=5VC9rvNx`,
      parser: (data) => ({
        link: data?.data?.link,
        name: data?.data?.filename,
        size: data?.data?.filesize,
        mime: data?.data?.ext
      })
    },
    {
      name: 'API Zeltoria',
      url: `https://api.zeltoria.my.id/api/downloader/mediafire?url=${encodeURIComponent(url)}`,
      parser: (data) => ({
        link: data?.result?.link,
        name: data?.result?.filename,
        size: data?.result?.filesizeH,
        mime: data?.result?.ext
      })
    },
    {
      name: 'API Widipe',
      url: `https://widipe.com/download/mediafire?url=${encodeURIComponent(url)}`,
      parser: (data) => ({
        link: data?.result?.link,
        name: data?.result?.filename,
        size: data?.result?.filesize,
        mime: data?.result?.ext
      })
    },
    {
      name: 'API Ryzen (Backup)',
      url: `https://api.ryzendesu.vip/api/downloader/mediafire?url=${encodeURIComponent(url)}`,
      parser: (data) => ({
        link: data?.url,
        name: data?.filename,
        size: data?.filesizeH,
        mime: data?.ext
      })
    }
  ];

  for (let i = 0; i < apis.length; i++) {
    try {
      console.log(`🔄 Probando ${apis[i].name}...`);
      
      const response = await fetch(apis[i].url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        },
        timeout: 10000
      });

      if (!response.ok) {
        console.log(`❌ ${apis[i].name} responded with status: ${response.status}`);
        continue;
      }

      const data = await response.json();
      const parsedData = apis[i].parser(data);
      
      if (parsedData.link && isValidUrl(parsedData.link)) {
        console.log(`✅ ${apis[i].name} devolvió datos válidos`);
        return {
          link: parsedData.link,
          name: parsedData.name || 'archivo_mediafire',
          size: parsedData.size || 'Tamaño desconocido',
          mime: parsedData.mime || getMimeFromFileName(parsedData.name)
        };
      }

    } catch (error) {
      console.error(`❌ ${apis[i].name} falló:`, error.message);
    }
  }

  console.log('❌ Todos los métodos fallaron');
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
  if (errorMsg.includes('No se pudo obtener')) {
    return 'El archivo no está disponible o el enlace ha expirado. Verifica el enlace de MediaFire.';
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
