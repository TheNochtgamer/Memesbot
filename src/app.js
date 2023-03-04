require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const configMgr = require('./utils/configMgr.js');
const { LogMgr, sleep, ReplyTimer } = require('./utils');
require('./utils/stringPlaceHolders');

const client = new Discord.Client({
  intents: [
    'GUILDS',
    'GUILD_MESSAGES',
    'GUILD_MESSAGE_REACTIONS',
    'GUILD_MEMBERS',
    'GUILD_WEBHOOKS',
    'GUILD_PRESENCES',
    'DIRECT_MESSAGES',
    'DIRECT_MESSAGE_REACTIONS',
  ],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  allowedMentions: { parse: ['users', 'roles', 'everyone'], repliedUser: true },
});

// globalThis.test = client;
globalThis.confi = require('./config.json');
globalThis.logme = new LogMgr();
globalThis.PFlags = Discord.Permissions.FLAGS;
client.totalInteractions = 0;
client.totalSuccessfullyInteractions = 0;
client.commands = new Discord.Collection();
client.owner = process.env.BOTOWNER;
client.timerAvailable = new ReplyTimer(10 * 1000).available;

function archivos() {
  const commandFiles = fs
    .readdirSync('./src/commands')
    .filter((file) => file.endsWith('.js'));
  const eventFiles = fs
    .readdirSync('./src/events')
    .filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
  }

  for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.name == 'ready' || event.once) {
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
        name: confi.activity0 || '',
        type: confi.activity1 || '',
        url: confi.activity2 || '',
      },
    ],
  });
}

//-//SECUENCIA DE BOOTEO
(async () => {
  confi = await configMgr.main();
  archivos();
  await client.login(process.env.TOKEN);
  await sleep(100);
  estadoUser();
  await logme.set(client);
})();
//-//
