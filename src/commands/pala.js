const {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require('discord.js');

module.exports = {
  raw: true,
  data: new SlashCommandBuilder()
    .setName('pala')
    .setDescription('HAY QUE AGARRAR LA PALA VIEJO')
    .addUserOption(option =>
      option
        .setName('mencion')
        .setDescription('Opcion para dedicarle la pala a alguien'),
    )
    .addStringOption(option =>
      option
        .setName('spoiler')
        .setDescription('Opcion para ponerlo como spoiler')
        .addChoices({ name: 'Si', value: '1' }, { name: 'No', value: '0' }),
    ),
  /**
   * @param {CommandInteraction} interaction
   */
  async run(interaction) {
    const user = interaction.options.getUser('mencion');
    const spoiler = interaction.options.get('spoiler')?.value || '0';
    const palasIds = ['982489887091621950', '988161502060085268'];
    const embed = new EmbedBuilder()
      .setColor('Red')
      .setDescription('Acaso estas intentando dedicarle una pala a un bot ???.')
      .setAuthor({ name: 'Error' });
    if (user?.bot) {
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const client = interaction.client;
    const copysChannel = await client.channels.fetch('982486981990817793');
    // let msg = await copysChannel.messages.fetch(palasIds[Math.floor(Math.random() * palasIds.length)]);
    let msg;
    if (spoiler === '0') {
      msg = await copysChannel.messages.fetch(palasIds[0]);
    } else {
      msg = await copysChannel.messages.fetch(palasIds[1]);
    }
    const video = msg.attachments.map(attachment => {
      return attachment.attachment;
    });

    try {
      if (!user) {
        await interaction.reply({ files: video });
      } else {
        await interaction.reply({ files: video, content: `<@!${user.id}>` });
      }
    } catch (error) {
      console.log('Hubo un error al intentar mostrar una pala:', error);
    }
  },
};

