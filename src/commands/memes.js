const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('memes')
        .setDescription('Comando para ver si el canal de memes stream esta abierto'),
    /**
     * @param {CommandInteraction} interaction 
     */
    async run(interaction) {
        const embed = new MessageEmbed()
        .setAuthor({name: interaction.guild.name})
        .setDescription("El canal de memes esta " + (confi.channelOpen ? "**abierto**" : "**cerrado**") + " actualmente.")
        .setColor(confi.channelOpen ? '#37EF0A' : '#E71515');
        if (interaction.guild.iconURL()) embed.setAuthor({iconURL: interaction.guild.iconURL(), name: interaction.guild.name});

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};