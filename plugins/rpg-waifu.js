import { promises as fs } from 'fs';

global.db = global.db || {};
global.db.waifu = global.db.waifu || {
    cooldowns: {},
    waifus: {},
    collection: {}
};


const waifuList = [
   
    {
        name: "Hatsune Chibi",
        rarity: "común",
        probability: 5,  
        img: "./src/chibis/miku_chibi.png"
    },
    {
        name: "Aoki Chibi",
        rarity: "común",
        probability: 5,  
        img: "./src/chibis/aoki_chibi.png"
    },
    {
        name: "Defoko Chibi",
        rarity: "común",
        probability: 5,  
        img: "./src/chibis/defoko_chibi.png"
    },
    {
        name: "Neru Chibi",
        rarity: "común",
        probability: 5,
        img: "./src/chibis/neru_chibi.png"
    },
    {
        name: "Rin Chibi",
        rarity: "común",
        probability: 5,
        img: "./src/chibis/rin_chibi.png"
    },
    {
        name: "Teto Chibi",
        rarity: "común",
        probability: 5,
        img: "./src/chibis/teto_chibi.png"
    },
    {
        name: "Gumi Chibi",
        rarity: "común",
        probability: 5,
        img: "./src/chibis/gumi_chibi.png"
    },
    {
        name: "Emu Chibi",
        rarity: "común",
        probability: 5,
        img: "./src/chibis/emu_chibi.png"
    },
    {
        name: "Len Chibi",
        rarity: "común",
        probability: 5,
        img: "./src/chibis/len_chibi.png"
    },
    {
        name: "Luka Chibi",
        rarity: "común",
        probability: 5,
        img: "./src/chibis/luka_chibi.png"
    },
    
    
    {
        name: "Hatsune Miku 2006",
        rarity: "rara",
        probability: 4.285,
        img: "./src/raros/miku_raro.png"
    },
    {
        name: "Aoki Lapis 2006",
        rarity: "rara",
        probability: 4.285,
        img: "./src/raros/aoki_raro.png"
    },
    {
        name: "Defoko Utau",
        rarity: "rara",
        probability: 4.285,
        img: "./src/raros/defoko_raro.png"
    },
    {
        name: "Akita Neru 2006",
        rarity: "rara",
        probability: 4.285,
        img: "./src/raros/neru_raro.png"
    },
    {
        name: "Gumi Megpoid 2006",
        rarity: "rara",
        probability: 4.285,
        img: "./src/raros/gumi_raro.png"
    },
    {
        name: "Rin",
        rarity: "rara",
        probability: 4.285,
        img: "./src/raros/rin_raro.png"
    },
    {
        name: "Teto",
        rarity: "rara",
        probability: 4.285,
        img: "./src/raros/teto_raro.png"
    },
    {
        name: "Emu Otori",
        rarity: "rara",
        probability: 4.285,
        img: "./src/raros/emu_raro.png"
    },
    {
        name: "Len",
        rarity: "rara",
        probability: 4.285,
        img: "./src/raros/len_raro.png"
    },
    {
        name: "Luka Megurine 2006",
        rarity: "rara",
        probability: 4.285,
        img: "./src/raros/luka_raro.png"
    },
    
    
    {
        name: "💙Miku💙",
        rarity: "épica",
        probability: 2.857,
        img: "./src/epicos/miku_epico.png"
    },
    {
        name: "🩵Aoki Lapis🩵",
        rarity: "épica",
        probability: 2.857,
        img: "./src/epicos/aoki_epico.png"
    },
    {
        name: "💜Defoko Utane💜",
        rarity: "épica",
        probability: 2.857,
        img: "./src/epicos/defoko_epico.png"
    },
    {
        name: "💛Neru💛",
        rarity: "épica",
        probability: 2.857,
        img: "./src/epicos/neru_epico.png"
    },
    {
        name: "💛Rin💛",
        rarity: "épica",
        probability: 2.857,
        img: "./src/epicos/rin_epico.png"
    },
    {
        name: "💚Gumi💚",
        rarity: "épica",
        probability: 2.857,
        img: "./src/epicos/gumi_epico.png"
    },
    {
        name: "❤Teto❤",
        rarity: "épica",
        probability: 2.857,
        img: "./src/epicos/teto_epico.png"
    },
    {
        name: "💗Emu💗",
        rarity: "épica",
        probability: 2.857,
        img: "./src/epicos/emu_epico.png"
    },
    {
        name: "Len (gei)",
        rarity: "épica",
        probability: 2.857,
        img: "./src/epicos/len_epico.png"
    },
    {
        name: "💗LUKA🪷",
        rarity: "épica",
        probability: 2.857,
        img: "./src/epicos/luka_epico.png"
    },
   
    
    {
        name: "💙HATSUNE MIKU💙",
        rarity: "ultra rara",
        probability: 1.429,
        img: "./src/ultra/miku_ultra.png"
    },
    {
        name: "🩵Aoki Lapis🩵",
        rarity: "ultra rara",
        probability: 1.429,
        img: "./src/ultra/aoki_ultra.png"
    },
    {
        name: "💜Utane Defoko💜",
        rarity: "ultra rara",
        probability: 1.429,
        img: "./src/ultra/defoko_ultra.png"
    },
    {
        name: "💛AKITA NERU💛",
        rarity: "ultra rara",
        probability: 1.429,
        img: "./src/ultra/neru_ultra.png"
    },
    {
        name: "💗EMU OTORI💗",
        rarity: "ultra rara",
        probability: 1.429,
        img: "./src/ultra/emu_ultra.png"
    },
    {
        name: "💚Megpoid Gumi💚",
        rarity: "ultra rara",
        probability: 1.429,
        img: "./src/ultra/gumi_ultra.png"
    },
    {
        name: "❤KASANE TETO❤",
        rarity: "ultra rara",
        probability: 1.429,
        img: "./src/ultra/teto_ultra.png"
    },
    {
        name: "💛KAGAMINE RIN💛",
        rarity: "ultra rara",
        probability: 1.429,
        img: "./src/ultra/rin_ultra.png"
    },
    {
        name: "💥KAGAMINE LEN💢",
        rarity: "ultra rara",
        probability: 1.429,
        img: "./src/ultra/len_ultra.png"
    },
    {
        name: "💗MEGUMIRE LUKA💮",
        rarity: "ultra rara",
        probability: 1.429,
        img: "./src/ultra/luka_ultra.png"
    },
    
    
    {
        name: "💙Brazilian Miku💛",
        rarity: "Legendaria",
        probability: 0.833,
        img: "./src/legend/miku_legend.jpg" 
    },
    {
        name: "🖤Inabakumori🖤",
        rarity: "Legendaria",
        probability: 0.833,
        img: "./src/legend/ibana_legend.jpg"
    },
    {
        name: "❤KASANE TETO❤",
        rarity: "Legendaria",
        probability: 0.833,
        img: "./src/legend/teto_legend.png"
    },
    {
        name: "☢️Cyberpunk Edgeruners💫",
        rarity: "Legendaria",
        probability: 0.833,
        img: "./src/legend/cyber_legend.png"
    },
    {
        name: "❤️🩷VOCALOIDS💛💙",
        rarity: "Legendaria",
        probability: 0.833,
        img: "./src/legend/voca_legend.jpg"
    },
    {
        name: "🏴‍☠️🌌HALO⚕️☢️",
        rarity: "Legendaria",
        probability: 0.833,
        img: "./src/legend/halo_legend.png"
    }
];


let totalProbability = 0;
for (const waifu of waifuList) {
    totalProbability += waifu.probability;
}
console.log(`Probabilidad total: ${totalProbability.toFixed(3)}%`); 

const rarityAnimations = {
    'común': 'https://media.tenor.com/AIHWOa8aHFAAAAAi/miku-hatsune.gif',
    'rara': 'https://media.tenor.com/AIHWOa8aHFAAAAAi/miku-hatsune.gif',
    'épica': 'https://media.tenor.com/AIHWOa8aHFAAAAAi/miku-hatsune.gif',
    'ultra rara': 'https://media.tenor.com/AIHWOa8aHFAAAAAi/miku-hatsune.gif',
    'Legendaria': 'https://media.tenor.com/AIHWOa8aHFAAAAAi/miku-hatsune.gif'
};

let handler = async (m, { conn }) => {
    const userId = m.sender;
    const currentTime = Date.now();
    
   
    if (global.db.waifu.cooldowns[userId]) {
        const timeDiff = currentTime - global.db.waifu.cooldowns[userId];
        if (timeDiff < 900000) {
            const remainingTime = 900000 - timeDiff;
            const minutes = Math.floor(remainingTime / 60000);
            const seconds = Math.floor((remainingTime % 60000) / 1000);
            return m.reply(`⏰ Debes esperar ${minutes}m ${seconds}s para volver a usar este comando.`);
        }
    }

    
    await conn.sendMessage(m.chat, { text: "💮 Invocando personaje..." });

   
    const roll = Math.random() * 100;
    let accumulatedProb = 0;
    let selectedWaifu = null;
    
    
    for (const waifu of waifuList) {
        accumulatedProb += waifu.probability;
        if (roll <= accumulatedProb) {
            selectedWaifu = waifu;
            break;
        }
    }
    
    
    if (!selectedWaifu) {
        selectedWaifu = waifuList[waifuList.length - 1];
        console.log("Warning: No se seleccionó waifu, usando el último de la lista");
    }

   
    console.log(`Roll: ${roll.toFixed(2)}, Rareza: ${selectedWaifu.rarity}, Nombre: ${selectedWaifu.name}`);

    
    try {
        const animationPath = rarityAnimations[selectedWaifu.rarity];
        await conn.sendMessage(m.chat, { 
            video: { url: animationPath },
            caption: "🏅 Revelando rareza...",
            gifPlayback: true
        });

       
        await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) {
        console.log("Error al enviar animación:", e);
    }

    
    const rarityColors = {
        'común': '⚪',
        'rara': '🔵',
        'épica': '🟣',
        'ultra rara': '🟡',
        'Legendaria': '🔴'
    };

   
    const rarityProbs = {
        'común': '35%',
        'rara': '30%',
        'épica': '20%',
        'ultra rara': '10%',
        'Legendaria': '5%'
    };

  
    let message = `🎲 WAIFU GACHA 🎲\n\n`;
    message += `👤 Invocador: @${userId.split('@')[0]}\n`;
    message += `${rarityColors[selectedWaifu.rarity]} Rareza: ${selectedWaifu.rarity.toUpperCase()} (${rarityProbs[selectedWaifu.rarity]})\n`;
    message += `💫 ¡Felicidades! Obtuviste a:\n`;
    message += `💙 ${selectedWaifu.name}\n`;
    message += `\n💫 Usa .save o .c para guardar tu waifu!`;

  
    await conn.sendMessage(m.chat, { 
        image: { url: selectedWaifu.img },
        caption: message,
        mentions: [userId]
    });

  
    global.db.waifu.cooldowns[userId] = currentTime;
    global.db.waifu.waifus[userId] = selectedWaifu;
}

handler.help = ['rw']
handler.tags = ['rpg']
handler.command = /^(rw|rollwaifu)$/i
handler.register = true
handler.group = true
handler.cooldown = 900000

export default handler
