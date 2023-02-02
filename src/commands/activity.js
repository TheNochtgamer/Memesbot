const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');
const configMgr = require('../utils/configMgr.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('activity')
        .setDescription('Establece la actividad actual del bot')
        .addSubcommand((subcommand) =>
            subcommand
                .setName("set")
                .setDescription("Establece la actividad actual del bot")
                .addStringOption((option) =>
                    option.setName("actividad")
                        .setDescription("El nombre de la actividad")
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('El tipo de la actividad')
                        .addChoices({ name: 'COMPETING', value: 'COMPETING' },
                            { name: 'LISTENING', value: 'LISTENING' },
                            { name: 'PLAYING', value: 'PLAYING' },
                            { name: 'STREAMING', value: 'STREAMING' },
                            { name: 'WATCHING', value: 'WATCHING' }))
                .addStringOption(option =>
                    option.setName('url')
                        .setDescription('En caso de que la actividad sea "STREAMING" colocar un link de twitch')))
        .addSubcommand((subcommand) =>
            subcommand
                .setName("reset")
                .setDescription("Borra la actividad actual del bot")),
    perms_req: ['MANAGE_MESSAGES'],
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @returns 
     */
    async run(interaction) {
        const varS = interaction.options.getSubcommand();

        if (varS === 'reset') {
            confi.activity0 = '';
            confi.activity1 = '';
            confi.activity2 = '';

            // interaction.client.user.setActivity('');
            interaction.client.user.setPresence({ activities: null });

            let sRes = await configMgr.save();
            if (sRes.success) {
                console.log(`Actividad del bot reseteada por ${interaction.user.tag}`);
                interaction.reply({ content: `Actividad reiniciada`, ephemeral: true });
            } else {
                console.log('Hubo un error al intentar guardar la configuracion (activity 0x0):', sRes.err);
                interaction.reply({ content: `Actividad reiniciada, pero no se pudo guardar`, ephemeral: true });
            }
            return;
        } else if (varS === 'set') {
            const var0 = interaction.options.getString('actividad');
            const var1 = interaction.options.getString('type');
            const var2 = interaction.options.getString('url');

            try {
                interaction.client.user.setPresence({ activities: [{ name: var0, type: var1, url: var2 }] });
                confi.activity0 = var0;
                confi.activity1 = var1;
                confi.activity2 = var2;
            } catch (error) {
                console.log('Hubo un error al intentar actualizar la actividad:', error);
                interaction.reply({ content: `Hubo un error al intentar actualizar la actividad`, ephemeral: true });
                return;
            }

            interaction.reply({ content: `Actividad actualizada`, ephemeral: true });

            let sRes = await configMgr.save();
            if (sRes.success) {
                console.log(`Actividad del bot actualizada por ${interaction.user.tag}`);
            } else {
                console.log('Hubo un error al intentar guardar la configuracion (activity 0x1):', sRes.err);
            }
            return;
        }
    }
}