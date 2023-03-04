const { Message } = require('discord.js');
const {
  reactmeme,
  secret,
  delnotauthorized,
  delnotauthorizedclip,
  dmControl,
  autoPublishAnnounce,
} = require('./eventfunctions');

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
      message.channel.type == 'DM' &&
      message.author.id == message.client.owner
    )
      dmControl(message);
  },
};
