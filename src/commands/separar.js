const {
  CommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require('discord.js');
const moment = require('moment');
const { fixMoment, confi } = require('../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('separar')
    .setDescription('Comando para poner separacion en el canal de memes')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  /**
   * @param {CommandInteraction} interaction
   */
  async run(interaction) {
    const guild = interaction.guild;
    const endChannel = guild.channels.cache.get(confi.channelEndId);

    if (!endChannel) {
      await interaction.reply({
        content: `No existe el canal de memes`,
        ephemeral: true,
      });
      return;
    }

    const separador = '-----------------------';
    const stampSeparador = '_ _                                    ';
    const date = fixMoment(moment());
    const stream = ` Stream ${date.format('DD/MM')} `;
    const tStamp = `<t:${date.unix()}:R>`;
    const line =
      separador +
      stream +
      separador +
      '\n' +
      stampSeparador +
      '[' +
      tStamp +
      ']';

    try {
      await Promise.all([
        endChannel.send({ content: line }),
        interaction.reply({ content: 'Mensaje enviado', ephemeral: true }),
      ]);
    } catch (error) {
      console.log(
        'Hubo un error al intentar enviar un mensaje al canal de memes:',
        error,
      );
      await interaction.reply({
        content: 'No se pudo enviar el mensaje',
        ephemeral: true,
      });
    }
  },
};

