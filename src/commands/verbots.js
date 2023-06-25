const {
  EmbedBuilder,
  SlashCommandBuilder,
  CommandInteraction,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verbots')
    .setDescription('Comando para ver los bots que hay en el discord'),
  /**
   * @param {CommandInteraction} interaction
   */
  async run(interaction) {
    let reply = `<@${interaction.client.user.id}> ⭐`;
    let replyOff = '';

    const miembros = await interaction.guild.members.fetch();
    miembros.forEach(member => {
      if (member.user.bot && member.user.id !== interaction.client.user.id) {
        if (!member.presence) {
          replyOff += `<@!${member.user.id}>\n`;
        } else {
          reply += `\n<@!${member.user.id}>`;
        }
      }
    });

    const embed = new EmbedBuilder()
      .setTitle('Bots disponibles:')
      .setDescription(reply)
      .setColor('Random');
    if (replyOff)
      embed.addFields({
        name: 'Bots offline:',
        value: replyOff,
        inline: false,
      });
    await interaction.reply({ embeds: [embed], ephemeral: false });
  },
};

