const {
  EmbedBuilder,
  CommandInteraction,
  ButtonBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  PermissionFlagsBits,
  ButtonStyle,
} = require('discord.js');
const moment = require('moment');
const { Memes, Hashes } = require('../database');
const { getSql, fixMoment, confi } = require('../utils');

const userBut = new ButtonBuilder()
  .setCustomId('userbut')
  .setLabel('Usuario')
  .setStyle(ButtonStyle.Primary);
const modBut = new ButtonBuilder()
  .setCustomId('modbut')
  .setLabel('Mod')
  .setStyle(ButtonStyle.Success);
const hashBut = new ButtonBuilder()
  .setCustomId('gethash')
  .setLabel('GetHash')
  .setStyle(ButtonStyle.Danger);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('checkmeme')
    .setDescription('Comando para revisar un meme verificado')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(option =>
      option
        .setName('id')
        .setDescription('El id del mensaje para revisar')
        .setRequired(true),
    ),

  /**
   * @param {CommandInteraction} interaction
   * @returns
   */
  async run(interaction) {
    const targetId = interaction.options.get('id')?.value;

    const guild = interaction.guild;
    const endChannel = guild.channels.cache.find(
      canal => canal.id === confi.channelEndId,
    );

    if (!endChannel) {
      await interaction.reply({
        content: `No se encontro el canal de memes`,
        ephemeral: true,
      });
      return;
    }

    if (confi.channelEndId !== interaction.channelId) {
      await interaction.reply({
        content:
          'Este comando solo se puede usar en el canal de memes' +
          (confi.channelEndId ? `: <#${confi.channelEndId}>` : ''),
        ephemeral: true,
      });
      return;
    }

    if (targetId.length < 18 || isNaN(targetId)) {
      await interaction.reply({
        content: `ID invalida.\nSelecciona el mensaje de un meme verificado y apreta en "Copiar ID".`,
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      content: `Buscando mensaje...`,
      ephemeral: true,
    });
    const interactionReply = await interaction.fetchReply();

    let result;
    try {
      // const Memes = require('../database/models/memes')(sequelize);
      result = await Memes.findOne({
        where: {
          msg_id: targetId,
        },
        raw: true,
      });
    } catch (error) {
      console.log('Hubo un error al intentar leer la base de datos:', error);
      interaction.editReply({
        content: `Hubo un error al intentar leer la base de datos`,
        ephemeral: true,
      });
      return;
    }

    if (!result) {
      interaction.editReply({
        content: `No se encontro el mensaje en la base de datos`,
        ephemeral: true,
      });
      return;
    }

    const msgTimestamp = fixMoment(moment(result.verified));
    const msgCreatedTimestamp = fixMoment(moment(result.created), true);
    let message;
    let linkButton;
    try {
      message = await interaction.channel.messages.fetch(targetId);
      linkButton = new ButtonBuilder()
        .setLabel('Volver')
        .setURL(message.url)
        .setStyle(ButtonStyle.Link);
    } catch (error) {
      console.log(
        'Hubo un error al intentar encontrar un msg (checkmeme1):',
        error,
      );
    }
    const botonera = new ActionRowBuilder().addComponents(
      userBut,
      modBut,
      linkButton || '',
      interaction.user.id === interaction.client.owner ? hashBut : '',
    );
    const filter = i =>
      i.user.id === interaction.user.id && i.message.id === interactionReply.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15 * 60 * 1000,
    });

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('Ver Meme')
      .addFields(
        {
          name: 'Enviado por:',
          value: `<@!${result.user_id}> [${result.user_id}]`,
          inline: false,
        },
        {
          name: 'Verificado por:',
          value: `<@!${result.mod_id}> [${result.mod_id}]`,
          inline: false,
        },
        {
          name: 'Verificado el:',
          value: `${msgTimestamp.format(
            'DD/MM/YY HH:mm',
          )}\n<t:${msgTimestamp.unix()}:R>`,
          inline: true,
        },
      )
      .setFooter({ text: interaction.client.user.username })
      .setTimestamp();

    if (result.created) {
      embed.addFields({
        name: 'Enviado el:',
        value: `${msgCreatedTimestamp.format(
          'DD/MM/YY HH:mm',
        )}\n<t:${msgCreatedTimestamp.unix()}:R>`,
        inline: true,
      });
    }
    if (interaction.member.id === interaction.client.owner) {
      embed.addFields({
        name: 'databaseID',
        value: 'ID=' + result.ID,
        inline: false,
      });
    }

    try {
      await interaction.editReply({
        content: '_ _',
        embeds: [embed],
        ephemeral: true,
        components: [botonera],
      });
    } catch (error) {
      console.log('Hubo un error al intentar responder un msg:', error);
      return;
    }

    collector.on('collect', async butInteraction => {
      if (butInteraction.customId === userBut.customId) {
        await butInteraction.reply({
          content: `<@!${result.user_id}>`,
          ephemeral: true,
        });
      } else if (butInteraction.customId === modBut.customId) {
        await butInteraction.reply({
          content: `<@!${result.mod_id}>`,
          ephemeral: true,
        });
      } else {
        let res;
        try {
          // const Hashes = require('../database/models/hashes')(sequelize);
          res = await Hashes.findAll({
            where: {
              msg_id: targetId,
            },
            raw: true,
          });
        } catch (error) {
          await butInteraction.reply({
            content: 'Hubo un error al intentar leer la base de datos',
            ephemeral: true,
          });
          return;
        }

        let hashes = '';
        res.forEach((rawModel, index) => {
          hashes += `-**${index + 1}**: ` + rawModel.hash + '\n';
        });

        const embed2 = new EmbedBuilder()
          .setColor('DarkRed')
          .setTitle('Hashes en este mensaje')
          .setDescription(
            hashes || 'Ninguno fue creado a partir de este mensaje.',
          )
          .setFooter({ text: interaction.client.user.username })
          .setTimestamp();

        await butInteraction.reply({ embeds: [embed2], ephemeral: true });
      }
    });
  },
};

