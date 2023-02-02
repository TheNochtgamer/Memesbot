const { Message, MessageEmbed } = require('discord.js');
const configMgr = require('../../utils/configMgr');
const helpMsg = `Usaste help, comandos disponibles:
-
 get [opcion] | Para retornar el valor de una variable o una constante en el programa
 ❌set {opcion} {valor} | Para establecer un valor de una variable
 toggleCh | Para toglear la apertura del canal de memes manualmente
-`

/**
 * @param {Message} message 
 */
module.exports = async function dmControl(message) {
    if (message.author.id !== message.client.owner) { await message.react('❌'); return };
    const contenido = message.content.split(' ');
    // TODO Crear un comando que se llame "set" para establecer variables de forma directa

    try {
        switch (contenido[0].toLowerCase()) {
            case 'help':
                await message.reply(helpMsg);
                break;
            case 'get':
                let toBack;
                // TODO Hacer que funcione el get, que al usarlo retorne las variables raw de la configuracion (confi)

                for (const var0 in confi) {
                    console.log(JSON.stringify(confi))
                    toBack += var0 + '\n';
                }
                await message.reply(toBack);
                break;
            case 'togglech':
                if (confi.channelOpen) {
                    confi.channelOpen = false;
                } else {
                    confi.channelOpen = true;
                }
                let sRes = await configMgr.save();
                if (sRes.success) {
                    await message.reply('Canal de memes => ' + (confi.channelOpen ? '"Abierto"' : '"Cerrado"'));
                } else {
                    await message.reply('Canal de memes => ' + (confi.channelOpen ? '"Abierto"' : '"Cerrado"') + '\nPero no se guardo en la base:\n' + '```\n' + sRes.err + '```');
                }
                break;
            case 'fc':
                const announceChId = '920377714907697222';
                let newMsg, anChannel;
                try {
                    anChannel = await message.client.channels.fetch(announceChId);
                    newMsg = await message.reply({ content: `Estas seguro de enviar el mensaje en <#${anChannel.id}>?` });

                    await newMsg.react('✅');
                } catch (error) {
                    try {
                        console.log('Hubo un error en DmControl:', error);
                        await message.reply('No se pudo encontrar el canal.');
                    } catch (error) {

                    }
                }

                const anFilter = (reaction, user) => reaction.emoji.name == '✅' && user.id == reaction.client.owner;
                const anCollector = newMsg.createReactionCollector({ filter: anFilter, max: 1, idle: 15000 });
                anCollector.on('end', async (collected, reason) => {
                    try {
                        await newMsg.delete();
                    } catch (error) {
                        console.log('Hubo un error en DmControl:', error);
                    }
                    if (reason == 'idle') {
                        try {
                            await message.react('❌');
                        } catch (error) {
                        }
                        return;
                    }

                    await message.reply('Comando Bloqueado.');
                    /*
                    const embed = new MessageEmbed()
                        .setAuthor({ name: 'Hoy es el cumpleaños del SrAmilcar', iconURL: 'https://cdn.discordapp.com/icons/562060884055293982/a_038a1e9c8ecc14ba61bafaf0431de425.webp' })
                        .setDescription('Vayan **TODOS** al <#562060884055293984> a saludar a ese viejo choto :dalecapo:')
                        .setColor('YELLOW')
                        .setFooter({text: '🍰'})
                        .setTimestamp()

                    let anMsg;
                    try {
                        anMsg = await anChannel.send({ content: '||@everyone||', embeds: [embed] });
                    } catch (error) {
                        console.log('Hubo un error en DmControl:', error);
                        message.reply('Hubo un error al intentar enviarlo');
                        return;
                    }
                    message.reply('Mensaje Enviado.\n' + anMsg.url);
                    */
                });
                break;
            default:
                await message.react('❌');
                break;
        }
    } catch (error) {
        console.log('Hubo un error en el evento "dmControl":', error);
    }

    /*
    } else if ('toggleCh') {
        
    } else if (contenido.startsWith('get')) {

    }*/
}