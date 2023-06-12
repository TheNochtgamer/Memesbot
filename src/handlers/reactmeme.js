const crypto = require('crypto');
const https = require('https');
const { Message } = require('discord.js');
const { eNames, confi } = require('../utils');

/**
 * @param {Message} message
 * @returns
 */
module.exports = async function reactmeme(message) {
  const guild = message.guild;
  const endChannel = guild?.channels?.cache?.get(confi.channelEndId);
  const cantidad =
    message.attachments.size + (message.content.includes('https://') ? 1 : 0);

  if (
    !confi.addReaction ||
    confi.channelStartId !== message.channel.id ||
    !endChannel ||
    cantidad <= 0
  )
    return;

  const isRecycled = (async (sended = false) => {
    if (!message.attachments.at(0) || !confi.memeRepetidoReact) return false;
    for (let index = 0; index < message.attachments.size && !sended; index++) {
      await new Promise(resolve => {
        https.get(message.attachments.at(index).proxyURL, res => {
          const hash = crypto.createHash('sha256');
          let hashDiges = '';
          hash.setEncoding('hex');
          res.pipe(hash);

          res.on('end', async () => {
            hash.end();
            hashDiges = hash.read();
            if (!hashDiges) return resolve();
            let res2;
            try {
              const { Hashes } = require('../database');
              // const Hashes = require('../../database/models/hashes')(sequelize);
              res2 = await Hashes.findOne({
                where: {
                  hash: hashDiges,
                },
              });
            } catch (error) {
              console.log(
                'Hubo un error al intentar leer la base de datos:',
                error,
              );
              return resolve();
            }

            if (res2?.hash !== hashDiges) return resolve();

            try {
              sended = true;
            } catch (error) {}
            return resolve();
          });
        });
      });
    }
    return sended;
  })();

  // Nunca se utilizo
  // const member = message.member;
  // const memberPerms = message.channel.permissionsFor(member.id);
  // const canManageMessages = memberPerms.has("MANAGE_MESSAGES");
  // const memberModRole = member.roles.cache.some((role) => role.id == confi?.monderatorId);
  // const canMuteHim = !member.moderatable;

  try {
    await message.react(eNames.approved);
    await message.react(eNames.disapproved);
    // Nunca se utilizo, aunque funcional
    // if (!(canManageMessages || memberModRole || canMuteHim)) await message.react("⏲️");

    if (await isRecycled) await message.react('♻️');
    if (!confi.numericReact) return;
    switch (cantidad) {
      case 1:
        break;
      case 2:
        await message.react('2️⃣');
        break;
      case 3:
        await message.react('3️⃣');
        break;
      case 4:
        await message.react('4️⃣');
        break;
      case 5:
        await message.react('5️⃣');
        break;
      default:
        await message.react('♾️');
        break;
    }
  } catch (error) {}
};

