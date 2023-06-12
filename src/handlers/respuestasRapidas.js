const { Message, Collection } = require('discord.js');
const { confi } = require('../utils');

const msgsRespuesta = {
  hola: async ({ message }) => {
    const holas = new Collection([
      ['1', 'Hola, como se encuentra usted?'],
      ['2', 'Hola!!'],
      ['3', 'Hola <:ruidomate:633419373121372160>'],
      ['4', `Buenas ${message.author}`],
    ]);
    await message.reply({ content: holas.random() });
  },
};

/**
 * @param {Message} message
 * @returns
 */
module.exports = async function respuestas(message) {
  const client = message.client;
  const mentionMe = message.content.match(
    new RegExp(`<@(?:!)?${client.user.id}>`),
  );
  const content = message.content
    .replace(new RegExp(`<@(?:!)?${client.user.id}>`, 'gi'), '')
    .trim()
    .toLowerCase();

  if (!mentionMe) return;

  try {
    await msgsRespuesta[content]({
      message,
      content,
    });
  } catch (error) {
    if (error.message.includes('is not a function')) return;
    console.log(`Hubo un error en ${__filename}:`, error);
  }
};
