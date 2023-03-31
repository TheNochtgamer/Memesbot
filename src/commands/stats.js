const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed } = require('discord.js');
const moment = require('moment');
const { PFlags } = require('../utils');
let statsCache = { timeout: moment().subtract(60, 's'), value: null };

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Ver las estadisticas de memes')
    .setDefaultMemberPermissions(PFlags.MANAGE_MESSAGES)
    .addStringOption(option =>
      option
        .setName('periodo')
        .setDescription('El periodo de tiempo de las estadisticas')
        .setChoices(
          { name: 'Siempre', value: '999999:Siempre' },
          { name: '1h', value: '0.04:1h' },
          { name: '12h', value: '0.5:12h' },
          { name: '24h', value: '1:24h' },
          { name: '7d', value: '7:7d' },
          { name: '14d', value: '14:14d' },
          { name: '1m', value: '30:1m' },
          { name: '2m', value: '60:2m' },
          { name: '3m', value: '90:3m' },
          { name: '6m', value: '180:6m' },
        ),
    ),
  // perms_req: ['MANAGE_MESSAGES'],
  /**
   * @param {CommandInteraction} interaction
   */
  async run(interaction) {
    const now = moment();
    const periodo = interaction.options.getString('periodo')?.split(':') || [
      '1',
      '24h',
    ];
    const inTime = Math.round(24 * periodo[0]);
    const embed = new MessageEmbed()
      .setAuthor({
        name: `${interaction.guild.name} Stats`,
        iconURL: interaction.guild.iconURL(),
      })
      .setColor('RANDOM')
      .setFooter({ text: interaction.client.user.username })
      .setDescription('Buscando en la base de datos...')
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });

    const isCacheAvaliable = moment(statsCache?.timeout).diff(now, 's') > -60;
    let result = isCacheAvaliable ? statsCache?.value : null;
    if (!result) {
      try {
        const { Memes } = require('../database');
        // const Memes = require('../database/models/memes')(sequelize);
        result = await Memes.findAll({
          raw: true,
        });
        statsCache = { timeout: now, value: result };
      } catch (error) {
        console.log('Hubo un error al intentar leer la base de datos:', error);
        embed.setDescription(
          'Hubo un error al intentar leer la base de datos.',
        );
        await interaction.editReply({ embeds: [embed], ephemeral: true });
        return;
      }
    }

    embed.setDescription('Analizando informacion...');
    await interaction.editReply({ embeds: [embed], ephemeral: true });

    const verifiedInTime = result.reduce((prev, meme) => {
      if (now.diff(moment(meme.verified), 'h') <= inTime && !meme.type) prev++;
      return prev;
    }, 0);
    const deletedInTime = result.reduce((prev, meme) => {
      if (now.diff(moment(meme.verified), 'h') <= inTime && !!meme.type) prev++;
      return prev;
    }, 0);
    // let lastVerified = moment(result.reverse().some(meme => meme.type == 0 && meme.verified)?.verified);

    const lastVerified = result.reduce((prev, meme) => {
      if (!meme.verified) return prev;
      if (!prev) prev = moment(meme.verified);
      if (!meme.type && prev.diff(moment(meme.verified), 's') < 0) {
        prev = moment(meme.verified);
      }
      return prev;
    }, null);

    const lastDeleted = result.reduce((prev, meme) => {
      if (!meme.verified) return prev;
      if (!prev) prev = moment(meme.verified);
      if (!!meme.type && prev.diff(moment(meme.verified), 's') < 0) {
        prev = moment(meme.verified);
      }
      return prev;
    }, null);

    embed
      .addFields(
        {
          name: '📝Verificados:',
          value: `**${verifiedInTime}**`,
          inline: true,
        },
        { name: '❌Eliminados:', value: `**${deletedInTime}**`, inline: true },
        { name: '_ _', value: '_ _' },
        {
          name: '🕐Ultimo Verificado:',
          value: `<t:${lastVerified?.unix()}:R>`,
          inline: true,
        },
        {
          name: '🕦Ultimo Eliminado:',
          value: `<t:${lastDeleted?.unix()}:R>`,
          inline: true,
        },
      )
      .setDescription(' ')
      .setTitle(`Estadisticas de hace ${periodo[1]}:`);
    return interaction.editReply({ embeds: [embed] });
  },
};

