require('dotenv').config();
const fs = require('fs');
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require('discord.js');
const configMgr = require('./utils/configMgr.js');
const { sleep, ReplyTimer, confi, logme } = require('./utils');
require('./utils/stringPlaceHolders');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  allowedMentions: { parse: ['users', 'roles', 'everyone'], repliedUser: true },
});

// globalThis.test = client;
client.totalInteractions = 0;
client.totalSuccessfullyInteractions = 0;
client.commands = new Collection();
client.owner = process.env.BOTOWNER;
client.timerAvailable = new ReplyTimer(10 * 1000).available;

function archivos() {
  const commandFiles = fs
    .readdirSync('./src/commands')
    .filter(file => file.endsWith('.js'));
  const eventFiles = fs
    .readdirSync('./src/events')
    .filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
  }

  for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.name === 'ready' || event.once) {
      client.once(event.name, (...args) => event.run(...args));
    } else {
      client.on(event.name, (...args) => event.run(...args));
    }
  }
  console.log('Eventos Cargados');
}

function estadoUser() {
  client.user.setPresence({
    activities: [
      {
        name: confi.activity0 || null,
        type: confi.activity1 || null,
        url: confi.activity2 || null,
      },
    ],
  });
}

// SECUENCIA DE BOOTEO
(async () => {
  await configMgr.init();
  archivos();
  await client.login(process.env.TOKEN);
  await sleep(100);
  setInterval(_ => {
    estadoUser();
  }, 1000 * 60 * 60);
  estadoUser();
  await logme.set(client, confi);
})();
//

