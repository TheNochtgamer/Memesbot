const {
  CommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
} = require('discord.js');
const { logme } = require('../utils/index.js');
const mins = 10 * 60 * 1000;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mate')
    .setDescription('Comando para dar un mate')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('Darle un mate a esta persona')
        .setRequired(true),
    ),

  /**
   * @param {CommandInteraction} interaction
   */
  async run(interaction) {
    const userId = interaction.user.id;
    const targetUser = interaction.options.getUser('user', true);
    const aceptBut = require('./butAceptarMate.js').button();
    const aceptRow = new ActionRowBuilder().addComponents(aceptBut);
    const respuestas = [
      `<@!${userId}> cebo un :mate: para ${targetUser}`,
      `<@!${userId}> le dio un :mate: a ${targetUser}`,
      // `${targetUser}, <@!${userId}> te cebo un mate`,
      `<@!${userId}> 🧉 ${targetUser}`,
    ];

    if (userId !== interaction.client.owner) {
      if (targetUser.bot) {
        await interaction.reply({
          content: 'No podes darle un mate a un bot.',
          ephemeral: true,
        });
        return;
      }

      if (userId === targetUser.id) {
        await interaction.reply({
          content: 'Enserio vas a hacer tanto escandalo para tomar mate solo?.',
          ephemeral: true,
        });
        return;
      }
    }

    logme.log(`${interaction.user.tag} le dio un mate a ${targetUser.tag}`);
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

