const {
  CommandInteraction,
  SlashCommandBuilder,
  PermissionsBitField,
} = require('discord.js');
const { logme } = require('../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Enviar mensajes')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
    .addStringOption(option =>
      option
        .setName('mensaje')
        .setDescription('Mensaje a enviar')
        .setRequired(true),
    )
    .addStringOption(option =>
      option
        .setName('edit')
        .setDescription('ID de un mensaje que envio el bot para editar'),
    )
    .addStringOption(option =>
      option
        .setName('reply')
        .setDescription('ID de un mensaje cualquiera para responder'),
    ),
  // roles_req: [confi.monderatorId],
  // perms_req: ['MANAGE_MESSAGES'],
  /**
   * @param {CommandInteraction} interaction
   * @returns
   */
  async run(interaction) {
    let msg = interaction.options.getString('mensaje', true).placeHolders();
    const toEdit = interaction.options.getString('edit');
    const toReply = interaction.options.getString('reply');
    const channel = interaction.channel;

    if (!toEdit) {
      if (
        msg === 'pingNocht' ||
        msg === 'pingN' ||
        msg === 'pingnocht' ||
        msg === 'pingn'
      ) {
        msg = '<@558020045771636747>';
      }
      try {
        if (!toReply) {
          await channel.send(msg);
        } else {
          if (toReply.length < 18 || isNaN(toEdit)) {
            await interaction.reply({
              content: `ID invalida.\nSelecciona el mensaje y apreta en "Copiar ID".`,
              ephemeral: true,
            });
            return;
          }
          let msgToReply;
          try {
            msgToReply = await channel.messages.fetch(toReply);
          } catch (error) {
            await interaction.reply({
              content: `No se pudo encontrar el mensaje para responder`,
              ephemeral: true,
            });
            return;
          }
          await msgToReply.reply({ content: msg });
        }
      } catch (error) {
        console.log('Hubo un error enviando un msg:', error);
        await interaction.reply({
          content: `No se pudo enviar el mensaje (error en la consola)`,
          ephemeral: true,
        });
        return;
      }
      logme.log(
        `${interaction.user.tag} envio un mensaje con el bot en: ${channel.name}`,
        `<@${interaction.user.id}> envio un mensaje con el bot en el canal: <#${interaction.channelId}>`,
        interaction.user.id,
        '#ECF138',
      );
      await interaction.reply({ content: `Mensaje enviado`, ephemeral: true });
    } else {
      if (toEdit.length < 18 || isNaN(toEdit)) {
        await interaction.reply({
          content: `ID invalida.\nSelecciona un mensaje del bot y apreta en "Copiar ID".`,
          ephemeral: true,
        });
        return;
      }
      let theMsg = '';
      try {
        theMsg = await channel.messages.fetch(toEdit);
      } catch (error) {
        await interaction.reply({
          content: `No se encontro el mensaje`,
          ephemeral: true,
        });
        return;
      }

      if (theMsg.author.id !== process.env.CLIENTID) {
        await interaction.reply({
          content: `El mensaje no le pertenece al bot`,
          ephemeral: true,
        });
        return;
      }

      if (!theMsg.editable) {
        await interaction.reply({
          content: `El bot no puede editar el mensaje`,
          ephemeral: true,
        });
        return;
      }

      try {
        logme.log(
          `${interaction.user.tag} edito un mensaje con el bot en: ${channel.name}`,
        );
        await theMsg.edit(msg);
        await interaction.reply({
          content: `Mensaje editado`,
          ephemeral: true,
        });
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: `No se pudo editar el mensaje`,
          ephemeral: true,
        });
      }
    }
  },
};

