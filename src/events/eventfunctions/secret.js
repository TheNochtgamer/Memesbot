const { Message } = require('discord.js');
let secretVal = 0;

/**
 * @param {Message} message
 * @returns
 */
module.exports = async function secret(message) {
  if (message.content.toLowerCase() === 'memebot123') {
    if (secretVal) return;
    try {
      secretVal = 1;
      await message.channel.send({
        content: `<@${message.author.id}> Encontraste un easter egg 😮`,
      });
      secretVal = 1;
      await message.delete();
    } catch (error) {}
    setTimeout(_ => (secretVal = 0), 60 * 1000);
  }
};
