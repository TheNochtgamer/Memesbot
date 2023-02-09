const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');
const moment = require('moment');
const configMgr = require('../utils/configMgr.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bloquear')
        .setDescription('Bloquea el canal de memes sin que nadie pueda verificar mas memes')
        .addSubcommand(subcommand =>
            subcommand.setName("memes")
                .setDescription('Bloquea el canal de memes sin que nadie pueda verificar mas memes')),
    roles_req: [confi.monderatorId],
    perms_req: ['MANAGE_MESSAGES'],
    /**
     * @param {CommandInteraction} interaction 
     * @returns 
     */
    async run(interaction) {
        const guild = interaction.guild;
        const endChannel = guild.channels.cache.get(confi.channelEndId);

        if (!endChannel) {
            await interaction.reply({ content: `No existe el canal de memes`, ephemeral: true });
            return;
        };

        if (confi.channelOpen) {
            interaction.reply({ content: `Canal de <#${confi.channelEndId}> cerrado`, ephemeral: true });
            //----------------------- Stream 05/05 -----------------------
            const separador = '-----------------------';
            const stampSeparador = '_ _                                    ';
            const date = moment();
            const stream = ` Stream ${date.format('DD/MM')} `;
            const tStamp = `<t:${date.unix()}:R>`;
            const line = separador + stream + separador + '\n' + stampSeparador + '[' + tStamp + ']';

            try {
                await endChannel.send({ 'content': line });
            } catch (error) {
                console.log('Hubo un error al intentar enviar un mensaje al canal de memes:', error);
            }
        } else {
            interaction.reply({ content: `Canal de <#${confi.channelEndId}> abierto`, ephemeral: true });
        }
        confi.channelOpen = !confi.channelOpen;

        let sRes = await configMgr.save();
        if (sRes.success) {
            logme.log(`${interaction.user.tag} actualizo el canal de memes a ${confi.channelOpen ? 'Abierto' : 'Cerrado'}`, `<@${interaction.user.id}> actualizo el canal de memes a ${confi.channelOpen ? 'Abierto' : 'Cerrado'}`, interaction.user.id);
        } else {
            console.log('Hubo un error al intentar guardar la configuracion (channelOpen):', sRes.err);
        }

        await Promise.allSettled([
            endChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, { 'ADD_REACTIONS': confi.channelOpen ? null : false }),
            endChannel.edit({ topic: `${confi.channelOpen ? 'Abierto' : 'Cerrado'} | <@` + process.env.CLIENTID + '>' }, 'Actualizacion del canal de memes'),
        ]);
    }
}