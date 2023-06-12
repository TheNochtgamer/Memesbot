const {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionsBitField,
} = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Comando para crear y enviar un embed')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
    .addStringOption(option => option.setName('title').setDescription('Titulo'))
    .addStringOption(option =>
      option.setName('description').setDescription('Descripcion'),
    )
    .addStringOption(option =>
      option
        .setName('color')
        .setDescription('Hex color del embed (opcional: random)'),
    )
    .addBooleanOption(option =>
      option.setName('timestamp').setDescription('Marca de tiempo'),
    )
    .addStringOption(option =>
      option.setName('author').setDescription('Author'),
    )
    .addStringOption(option =>
      option.setName('authoricon').setDescription('Author Url Icon'),
    )
    .addStringOption(option =>
      option.setName('authorurl').setDescription('Author Url'),
    )
    .addStringOption(option =>
      option.setName('footer').setDescription('Footer'),
    )
    .addStringOption(option =>
      option.setName('footericon').setDescription('Footer Url Icon'),
    )
    .addStringOption(option => option.setName('url').setDescription('Url')),
  // perms_req: ['MANAGE_MESSAGES'],
  /**
   * @param {CommandInteraction} interaction
   * @returns
   */
  async run(interaction) {
    const embed = new EmbedBuilder();
    const embedErr = new EmbedBuilder().setColor('RED').setTimestamp();

    try {
      if (interaction.options.getString('author'))
        embed.setAuthor({
          name: interaction.options.getString('author').placeHolders(),
          iconURL: interaction.options.getString('authoricon'),
          url: interaction.options.getString('authorurl'),
        });
      if (interaction.options.getString('description'))
        embed.setDescription(
          interaction.options.getString('description').placeHolders(),
        );
      if (interaction.options.getString('title'))
        embed.setTitle(interaction.options.getString('title').placeHolders());
      if (interaction.options.getString('color'))
        embed.setColor(
          interaction.options.getString('color') === 'random'
            ? randomColor()
            : interaction.options.getString('color'),
        );
      if (interaction.options.getBoolean('timestamp')) embed.setTimestamp();
      if (interaction.options.getString('footer'))
        embed.setFooter({
          text: interaction.options.getString('footer').placeHolders(),
          iconURL: interaction.options.getString('footericon'),
        });
      if (interaction.options.getString('url'))
        embed.setURL(interaction.options.getString('url'));
    } catch (error) {
      embedErr.setDescription('```\n' + error + '```');
      await interaction.reply({
        content: `No se pudo **generar** el embed`,
        embeds: [embedErr],
        ephemeral: true,
      });
      return;
    }

    try {
      await interaction.channel.send({ embeds: [embed] });
    } catch (error) {
      embedErr.setDescription('```\n' + error + '```');
      await interaction.reply({
        content: `No se pudo **enviar** el mensaje`,
        embeds: [embedErr],
        ephemeral: true,
      });
      return;
    }
    await interaction.reply({ content: `Mensaje enviado`, ephemeral: true });
  },
};

