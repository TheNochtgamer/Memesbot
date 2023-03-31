const {
  MessageButton,
  ButtonInteraction,
  MessageMentions: { USERS_PATTERN },
} = require('discord.js');
const { logme } = require('../utils');

module.exports = {
  data: { name: 'timeout' },
  button: () => {
    return new MessageButton()
      .setCustomId('timeout')
      .setLabel('⏲️')
      .setStyle('DANGER');
  },
  perms_req: ['MODERATE_MEMBERS'],
  /**
   * @param {ButtonInteraction} interaction
   */
  async run(interaction) {
    const msg = interaction.message.content;
    const userExec = interaction.user;
    const matches = msg.matchAll(USERS_PATTERN).next().value;
    const userId = matches[1];
    const member = await interaction.guild.members.fetch(userId);

    if (userId === userExec.id) {
      await interaction.reply({
        content: `No te podes aislar a vos mismo ❌`,
        ephemeral: true,
      });
      return;
    }
    if (member.permissions.has('MODERATE_MEMBERS')) {
      await interaction.reply({
        content: `No podes aislar a esta persona ❌`,
        ephemeral: true,
      });
      return;
    }

    try {
      await member.timeout(
        5 * 60 * 1000,
        `Boton en memes a verificar por ${userExec.id}`,
      );
      logme.log(
        `El usuario ${userExec.tag} aislo a ${member.displayName} por 5 minutos usando un boton`,
        `El usuario <@${userExec.id}> aislo a <@${userId}> por 5 minutos usando un boton`,
        userExec.id,
        '#67FF0D',
      );
      await interaction.reply({
        content: `<@${userId}> fue aislado por 5 minutos ✅`,
        ephemeral: true,
      });
    } catch (error) {
      await interaction.reply({
        content: `Hubo un error, no se pudo aislar a <@${userId}> ❌`,
        ephemeral: true,
      });
    }
  },
};

