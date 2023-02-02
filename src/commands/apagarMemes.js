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

        if (!(confi.channelEndId)) {
            interaction.reply({ content: `No existe el canal de memes (0x1)`, ephemeral: true });
            return;
        };
        const endChannel = guild.channels.cache.find(canal => canal.id == confi.channelEndId);

        if (!endChannel) {
            interaction.reply({ content: `No existe el canal de memes (0x2)`, ephemeral: true });
            return;
        };


        if (confi.channelOpen == true) {

            confi.channelOpen = false;
            interaction.reply({ content: `Canal de <#${confi.channelEndId}> cerrado`, ephemeral: true });
            //----------------------- Stream 05/05 -----------------------
            const separador = "-----------------------";
            const stampSeparador = "_ _                                    ";
            const date = moment();
            const stream = ` Stream ${date.format('DD/MM')} `;
            const tStamp = `<t:${date.unix()}:R>`;

            try {
                await endChannel.send(separador + stream + separador + '\n' + stampSeparador + '[' + tStamp + ']');
            } catch (error) {
                console.log('Hubo un error al intentar enviar un mensaje al canal de memes:', error);
            }
        } else {
            confi.channelOpen = true;
            interaction.reply({ content: `Canal de <#${confi.channelEndId}> abierto`, ephemeral: true });
        }

        let sRes = await configMgr.save();
        if (sRes.success) {
            logme.log(`${interaction.user.tag} actualizo el canal de memes a ${confi.channelOpen ? 'Abierto' : 'Cerrado'}`, `<@${interaction.user.id}> actualizo el canal de memes a ${confi.channelOpen ? 'Abierto' : 'Cerrado'}`, interaction.user.id);
            //const confis = JSON.stringify(confi);
            //fs.writeFileSync('./config.json', confis);
        } else {
            console.log('Hubo un error al intentar guardar la configuracion (channelOpen):', err);
        }

        try {
            await endChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, { 'ADD_REACTIONS': confi.channelOpen ? null : false });
            await endChannel.edit({ topic: `${confi.channelOpen ? 'Abierto' : 'Cerrado'} | <@` + process.env.CLIENTID + '>' }, 'Actualizacion del canal de memes');
        } catch (error) {
            console.log('Hubo un error con la descripcion de un canal:', error);
        }
    }
}