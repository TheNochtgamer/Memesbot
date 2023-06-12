const {
  ButtonBuilder,
  ButtonInteraction,
  MessageMentions: { USERS_PATTERN },
  EmbedBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require('discord.js');

module.exports = {
  data: { name: 'aceptmate' },
  button: () => {
    return new ButtonBuilder()
      .setCustomId('aceptmate')
      .setLabel('Aceptar')
      .setStyle(ButtonStyle.Primary);
  },
  /**
   * @param {ButtonInteraction} interaction
   */
  async run(interaction) {
    const msg = interaction.message.content;
    const user = interaction.user;
    const matches = msg.substring(22).matchAll(USERS_PATTERN).next().value;
    const ruidomateE = interaction.client.emojis.cache.find(
      emoji => emoji.name === 'ruidomate',
    );
    const embed = new EmbedBuilder()
      .setColor('Red')
      .setDescription('Este mate no te lo cebaron a vos.')
      .setAuthor({ name: 'Error' });

    if (interaction.message.interaction?.user?.id === user.id) {
      embed.setDescription(
        'Este mate se lo diste a otra persona, no hay devoluciones.',
      );
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (matches[1] !== user.id) {
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const disabButton = this.button().setDisabled(true);
    const buttonRow = new ActionRowBuilder().addComponents(disabButton);

    try {
      await interaction.update({ content: msg, components: [buttonRow] });
      await interaction.followUp({
        content: `${ruidomateE}`,
        allowedMentions: { repliedUser: false },
      });
    } catch (error) {
      console.log('Hubo un error respondiendo un boton:', error);
    }
  },
};
