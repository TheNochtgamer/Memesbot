const { Message } = require('discord.js');
const { confi } = require('../utils');
const {
  reactmeme,
  secret,
  delnotauthorized,
  delnotauthorizedclip,
  dmControl,
  autoPublishAnnounce,
  respuestas,
} = require('../handlers');
const { ChannelType } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  /**
   * @param {Message} message
   * @returns
   */
  async run(message) {
    if (confi?.autoPublishAnnounces) autoPublishAnnounce(message);

    if (message.author.bot) return;

    reactmeme(message);
    if (confi?.deleteNotAuth) delnotauthorized(message);
    if (confi?.channelClipsId) delnotauthorizedclip(message);
    secret(message);
    if (
      message.channel.type === ChannelType.DM &&
      message.author.id === message.client.owner
    )
      dmControl(message);
    respuestas(message);
  },
};

