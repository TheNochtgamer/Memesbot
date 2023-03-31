const { Message, MessageEmbed } = require('discord.js');
const { confi } = require('../../utils');
const configMgr = require('../../utils/configMgr');
const helpMsg = `Usaste help, comandos disponibles:
-
 get [opcion] | Para retornar el valor de una variable o una constante en el programa
 ❌set {opcion} {valor} | Para establecer un valor de una variable
 toggleCh | Para toglear la apertura del canal de memes manualmente
-`;

/**
 * @param {Message} message
 */
module.exports = async function dmControl(message) {
  if (message.author.id !== message.client.owner) {
    await message.react('❌');
    return;
  }
  const contenido = message.content.split(' ');
  // TODO Crear un comando que se llame "set" para establecer variables de forma directa

  try {
    switch (contenido[0].toLowerCase()) {
      case 'help':
        await message.reply(helpMsg);
        break;
      case 'get': {
        let toBack;
        // TODO Hacer que funcione el get, que al usarlo retorne las variables raw de la configuracion (confi)

        for (const var0 in confi) {
          console.log(JSON.stringify(confi));
          toBack += var0 + '\n';
        }
        await message.reply(toBack);
        break;
      }
      case 'togglech': {
        if (confi.channelOpen) {
          confi.channelOpen = false;
        } else {
          confi.channelOpen = true;
        }
        const sRes = await configMgr.save();
        if (sRes.success) {
          await message.reply(
            'Canal de memes => ' +
              (confi.channelOpen ? '"Abierto"' : '"Cerrado"'),
          );
        } else {
          await message.reply(
            'Canal de memes => ' +
              (confi.channelOpen ? '"Abierto"' : '"Cerrado"') +
              '\nPero no se guardo en la base:\n' +
              '```\n' +
              sRes.err +
              '```',
          );
        }
        break;
      }
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

    } */
};

