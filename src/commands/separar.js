const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');
const moment = require('moment');
const { fixMoment } = require('../utils');

module.exports = {
    raw: true,
    data: new SlashCommandBuilder()
        .setName('separar')
        .setDescription('Comando para poner separacion en el canal de memes'),
    roles_req: [confi.monderatorId, '804900054153560084'],
    perms_req: ['MANAGE_MESSAGES'],
    /**
     * @param {CommandInteraction} interaction 
     */
    async run(interaction) {
        const guild = interaction.guild;

        if (!(confi.channelEndId)) {
            await interaction.reply({ content: `No existe el canal de memes`, ephemeral: true });
            return;
        };

        if (!(confi.channelEndId == interaction.channelId)) {
            await interaction.reply({ content: 'Este comando solo se puede usar en el canal de memes' + (confi.channelEndId ? `: <#${confi.channelEndId}>` : ''), ephemeral: true });
            return;
        }

        const endChannel = guild.channels.cache.find(canal => canal.id == confi.channelEndId);
        const separador = "-----------------------";
        const stampSeparador = "_ _                                    ";
        const date = fixMoment(moment());
        const stream = ` Stream ${date.format('DD/MM')} `;
        const tStamp = `<t:${date.unix()}:R>`;

        try {
            await endChannel.send(separador + stream + separador + '\n' + stampSeparador + '[' + tStamp + ']');
            await interaction.reply({ content: 'Mensaje enviado', ephemeral: true });
        } catch (error) {
            console.log('Hubo un error al intentar enviar un mensaje al canal de memes:', error);
            await interaction.reply({ content: 'No se pudo enviar el mensaje', ephemeral: true });
        }
    },
};