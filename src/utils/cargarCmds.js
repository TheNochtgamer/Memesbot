require("dotenv").config();
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Permissions } = require('discord.js');

globalThis.confi = require('../config.json');
globalThis.PFlags = Permissions.FLAGS;

const commands = [];
console.log('[P] Leyendo archivos...');
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

console.log('[P] Analizando archivos...');
for (const file of commandFiles) {
    console.log('[file] ' + file + ' :');
    const command = require(`../commands/${file}`);
    if (command.button) {console.log(`[name] ^ Skipping button "${command.button().customId}"...`); continue};
    console.log('[name] ^ ' + command.data?.name);

    if (!command.raw) {
        commands.push(command.data.toJSON());
    } else {
        commands.push(command.data);
    }
}

(() => {
    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN)
    rest.put(Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID), { body: commands })
        .then(_ => {
            console.log('[P] Comandos cargados correctamente.');
        })
        .catch(console.error);
})();