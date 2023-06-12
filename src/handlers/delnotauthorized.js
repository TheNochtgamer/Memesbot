const { Message, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const { confi, logme } = require('../utils');
const timeoutBut = require('../commands/butTimeout.js').button();

/**
 * @param {Message} message
 * @returns
 */
module.exports = async function delnotauthorized(message) {
  const channel = message.channel;
  if (confi.channelStartId !== channel.id) {
    return;
  }

  if (message.attachments.size !== 0 || message.content.includes('https://'))
    return;

  const author = message.author;
  const guild = message.guild;
  const member = await guild.members.fetch(author.id);
  const memberPerms = channel.permissionsFor(member.id);
  const canManageMessages = memberPerms.has('MANAGE_MESSAGES');
  const memberModRole = member.roles.cache.some(
    role => role.id === confi.monderatorId,
  );
  const compRow = new ActionRowBuilder().addComponents(timeoutBut);

  if (canManageMessages || memberModRole) return;

  try {
    if (message.deletable) await message.delete();
  } catch (error) {
    console.log('Hubo un error borrando un msg no autorizado:', error);
    return;
  }

  if (!confi.replyMsg || !message.client.timerAvailable()) return;

  logme.log(
    `${author.tag} no tiene permisos para mandar un comentario en el canal ${channel.name}`,
    `<@${author.id}> no tiene permisos para mandar un comentario en el canal <#${channel.id}>`,
    author.id,
    '#FF0000',
  );

  const embed = new EmbedBuilder()
    .setColor('Red')
    .setDescription(
      '**No** tenes permisos para enviar comentarios en este canal ❌',
    )
    .setAuthor({ name: 'Error' })
    .setFooter({ text: message.client.user.username })
    .setTimestamp();

  const [res] = await Promise.allSettled([
    channel.send({
      content: `<@${author.id}>`,
      embeds: [embed],
      components: [compRow],
    }),
  ]);
  if (res.status === 'rejected')
    return console.log(
      'Hubo un error al intentar enviar un mensaje:',
      res.reason,
    );
  setTimeout(async () => {
    try {
      await res.value.delete();
    } catch (error) {
      console.log('Hubo un error borrando un msg:', error);
    }
  }, 16000);
};

