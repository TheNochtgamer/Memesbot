const {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Comando para crear y enviar un embed')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
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

  /**
   * @param {CommandInteraction} interaction
   * @returns
   */
  async run(interaction) {
    const embed = new EmbedBuilder();
    const embedErr = new EmbedBuilder().setColor('Red').setTimestamp();

    const author = interaction.options.get('author')?.value?.placeHolders();
    const authoricon = interaction.options.get('authoricon')?.value;
    const authorurl = interaction.options.get('authorurl')?.value;
    const title = interaction.options.get('title')?.value?.placeHolders();
    const description = interaction.options
      .get('description')
      ?.value?.placeHolders();
    const color = interaction.options.get('color')?.value;
    const timestamp = interaction.options.get('timestamp')?.value;
    const footer = interaction.options.get('footer')?.value?.placeHolders();
    const footericon = interaction.options.get('footericon')?.value;
    const url = interaction.options.get('url')?.value;

    try {
      if (author)
        embed.setAuthor({
          name: author,
          iconURL: authoricon,
          url: authorurl,
        });
      if (description) embed.setDescription(description);
      if (title) embed.setTitle(title);
      if (color)
        embed.setColor(color.slice(0, 1).toUpperCase() + color.slice(1));
      if (timestamp) embed.setTimestamp();
      if (footer)
        embed.setFooter({
          text: footer,
          iconURL: footericon,
        });
      if (url) embed.setURL(url);
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

