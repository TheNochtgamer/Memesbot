const {
  WebhookClient,
  EmbedBuilder,
  Message,
  GuildMember,
} = require('discord.js');

/**
 * @param {Message} message
 * @param {Message} message2
 * @param {GuildMember} member
 * @returns {void}
 */
async function sendBackWebhook(message, { id: msg2id }, member) {
  if (!process.env.BACKWEBHOOKURL) return;

  const backwebhook = new WebhookClient({ url: process.env.BACKWEBHOOKURL });
  const embed = new EmbedBuilder()
    .setColor('Grey')
    .setAuthor({
      name: message.author.tag,
      iconURL: message.author.avatarURL(),
    })
    .setDescription(
      `Msg id: ${msg2id}\nEnviado id: <@${message.author.id}> [${message.author.id}]\nMod id: <@${member.id}> [${member.id}]`,
    )
    .setTimestamp();

  try {
    await backwebhook.send({ embeds: [embed] });
  } catch (error) {
    console.log('Hubo un error al intentar enviar el log de un meme:', error);
  }
}

module.exports = sendBackWebhook;

