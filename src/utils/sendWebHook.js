const {
  TextChannel,
  MessagePayload,
  WebhookMessageOptions,
  Message,
} = require('discord.js');

/**
 * @param {TextChannel} channel
 * @param {string | MessagePayload | WebhookMessageOptions} options
 * @returns {Promise<Message>}
 */
async function sendWebHook(channel, options) {
  const webhooks = await channel.fetchWebhooks();
  let webhook = webhooks.find(wh => wh.token);

  if (!webhook) {
    webhook = await channel.createWebhook('Memeshook');
  }

  return webhook.send(options).then(message => {
    return message;
  });
}

module.exports = sendWebHook;
