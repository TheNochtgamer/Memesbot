const { ButtonInteraction } = require('discord.js');
const { notAuthorized } = require('../utils');

module.exports = {
  name: 'interactionCreate',
  /**
   * @param {ButtonInteraction} interaction
   * @returns
   */
  async run(interaction) {
    if (!interaction.isButton()) return;

    const button = interaction.client.commands.get(interaction.customId);
    interaction.client.totalInteractions++;

    if (!button || button?.ignore) {
      return;
    }

    //--NCheckAuth--
    //Parametros en button files:
    // roles_req = String[]
    // perms_req = String[]
    // allRoles_req = Boolean
    // allPerms_req = Boolean
    // everthing_req = Boolean
    const pass = () => {
      if (interaction.user.id === interaction.client.owner) return 1;

      const all = button.everthing_req;
      const member = interaction.member;
      let notPass = 0,
        checks = 0;

      if (button.roles_req) {
        checks++;
        if (!member.roles.cache.hasAny(...button.roles_req))
          if (all) {
            return 0;
          } else {
            notPass++;
          }
        if (
          !member.roles.cache.hasAll(...button.roles_req) &&
          button.allRoles_req
        )
          if (all) {
            return 0;
          } else {
            notPass++;
          }
      }
      if (button.perms_req) {
        checks++;
        let permPass = false;
        for (const perm of button.perms_req) {
          if (member.permissions.has(perm)) {
            permPass = true;
            if (!button.allPerms_req) {
              break;
            }
          } else {
            permPass = false;
            if (button.allPerms_req) break;
          }
        }
        if (!permPass) {
          if (all) {
            return 0;
          } else {
            notPass++;
          }
        }
      }

      if (notPass == checks && checks) return 0;
      return 1;
    };
    if (!pass()) {
      notAuthorized(interaction);
      return;
    }
    //--NCheckAuth--

    try {
      await button.run(interaction);
      interaction.client.totalSuccessfullyInteractions++;
    } catch (error) {
      console.error(
        'Hubo un error ejecutando el boton ' +
          interaction.customId +
          ': ' +
          error
      );
      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.editReply({
            content: 'Hubo un error interno al ejecutar el boton',
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: 'Hubo un error interno al ejecutar el boton',
            ephemeral: true,
          });
        }
      } catch (error) {}
    }
  },
};
