const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Ver las estadisticas de memes'),
    perms_req: ['MANAGE_MESSAGES'],
    /**
     * @param {CommandInteraction} interaction 
     */
    async run(interaction) {
        await interaction.reply({ 'content': 'Command not finished.', 'ephemeral': true });
        return
        await interaction.deferReply({ 'ephemeral': true });

        let result = null;
        try {
            const sequelize = require('../database');
            const Memes = require('../database/models/memes')(sequelize);
            result = await Memes.findAll({
                raw: true
            });
        } catch (error) {
            console.log("Hubo un error al intentar leer la base de datos:", error)
            interaction.editReply({ content: `Hubo un error al intentar leer la base de datos`, ephemeral: true });
            return;
        }

        const embed = new MessageEmbed()
    },
};