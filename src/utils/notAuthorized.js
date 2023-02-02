const { MessageEmbed, CommandInteraction } = require('discord.js');

/**
 * @param {CommandInteraction} interaction 
 * @returns 
 */
module.exports = async function noauthreply(interaction) {
    const embed = new MessageEmbed()
        .setColor('RED')
        .setAuthor({ name: '⛔Prohibido'})
        .setDescription('```' + interaction.user.tag + ' no tenes permisos para usar este comando.```')
        .setTimestamp()
        .setFooter({ text: `ID: ${interaction.user.id}` });

    try {
        if (interaction.deferred || interaction.replied) {
            await interaction.editReply({ embeds: [embed], ephemeral: true });
        } else {
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    } catch (error) { }
}