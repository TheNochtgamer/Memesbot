const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { ContextMenuInteraction, MessageActionRow } = require('discord.js');
const { logme } = require('../utils/index.js');
const mins = 10 * 60 * 1000;

module.exports = {
  data: new ContextMenuCommandBuilder().setName('Dar Un Mate').setType(2),
  // roles_req: ['941908888113008741', '803293274672332880', '898615642389897296', '617380124106555392', '777691011316449291'],
  /**
   * @param {ContextMenuInteraction} interaction
   */
  async run(interaction) {
    const userId = interaction.user.id;
    const targetUserId = interaction.targetId;
    const otherUser = interaction.guild.members.cache.get(targetUserId);
    const aceptBut = require('./butAceptarMate.js').button();
    const aceptRow = new MessageActionRow().addComponents(aceptBut);
    const respuestas = [
      `<@!${userId}> cebo un :mate: para <@!${targetUserId}>`,
      `<@!${userId}> le dio un :mate: a <@!${targetUserId}>`,
      `<@!${targetUserId}>, <@!${userId}> te cebo un mate`,
      `<@!${userId}> 🧉 <@!${targetUserId}>`,
    ];

    if (userId !== interaction.client.owner) {
      if (otherUser.user.bot) {
        await interaction.reply({
          content: 'No podes darle un mate a un bot.',
          ephemeral: true,
        });
        return;
      }

      if (userId === targetUserId) {
        await interaction.reply({
          content: 'Enserio vas a hacer tanto escandalo para tomar mate solo?.',
          ephemeral: true,
        });
        return;
      }
    }

    logme.log(`${interaction.user.tag} le dio un mate a ${otherUser.user.tag}`);
    await interaction.reply({
      content: respuestas[Math.floor(Math.random() * respuestas.length)],
      components: [aceptRow],
    });
    setTimeout(async () => {
      try {
        const msg = await interaction.fetchReply();
        if (msg.components[0]?.components[0]?.disabled) return;
        aceptBut.setDisabled(true);
        await interaction.editReply({
          components: [aceptRow],
          content: msg.content + `\n*Pero esta persona no lo acepto a tiempo*`,
        });
      } catch (error) {
        console.log('Hubo un error editando un msg de mate:', error);
      }
    }, mins);
  },
};

