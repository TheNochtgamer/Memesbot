const { Interaction } = require('discord.js');
const { notAuthorized } = require('../utils');

module.exports = {
  name: 'interactionCreate',
  /**
   * @param {Interaction} interaction
   * @returns
   */
  async run(interaction) {
    if (!(interaction.isCommand() || interaction.isApplicationCommand()))
      return;

    const command = interaction.client.commands.get(interaction.commandName);
    interaction.client.totalInteractions++;

    if (!command) {
      if (interaction.replied) return;
      interaction.reply({
        content:
          'Hubo un error interno 404 al intentar encontrar el comando\nPorfavor intenta mas tarde...',
        ephemeral: true,
      });
      return;
    }

    /* Deprecated
        if (!beNocht) {
            const member0 = await interaction.guild.members.fetch(interaction.user.id);
            let notPass = 0;
            let maxPass = (command.rolRequerido ? 1 : 0) + (command.permRequerido ? +1 : +0);
            console.log(maxPass)
            if (command.rolRequerido) {
                let roles = command.rolRequerido.length;
                for (const roleId of command.rolRequerido) {
                    const role0 = member0.roles.cache.get(roleId);
                    if (command.rolAllReq) {
                        if (!role0) { notPass += 1; break; };
                    } else {
                        if (role0) { break; } else {
                            roles -= 1;
                        };
                        if (roles == 0) { notPass += 1; break; };
                    }
                }
            }
            if (command.permRequerido) {
                let permisos = command.permRequerido.length;
                for (const permType of command.permRequerido) {
                    const perms0 = member0.permissions.has(permType);
                    if (command.permAllReq) {
                        if (!perms0) { notPass += 1; break; };
                    } else {
                        if (perms0) { break; } else {
                            permisos -= 1;
                        };
                        if (permisos == 0) { notPass += 1; break; };
                    }
                }
            }
            if (notPass != 0) {
                if (command.stricted) {
                    notAuthorized(interaction);
                    return;
                } else if (notPass == 1 && maxPass == 2) {
                } else {
                    notAuthorized(interaction);
                    return;
                }
            }
        } */

    // --NCheckAuth--
    // Parametros en command files:
    // roles_req = String[]
    // perms_req = String[]
    // allRoles_req = Boolean
    // allPerms_req = Boolean
    // everthing_req = Boolean
    const pass = () => {
      if (interaction.user.id === interaction.client.owner) return 1;

      const all = command.everthing_req;
      const member = interaction.member;
      let notPass = 0;
      let checks = 0;

      if (command.roles_req) {
        checks++;
        if (!member.roles.cache.hasAny(...command.roles_req))
          if (all) {
            return 0;
          } else {
            notPass++;
          }
        if (
          !member.roles.cache.hasAll(...command.roles_req) &&
          command.allRoles_req
        )
          if (all) {
            return 0;
          } else {
            notPass++;
          }
      }
      if (command.perms_req) {
        checks++;
        let permPass = false;
        for (const perm of command.perms_req) {
          if (member.permissions.has(perm)) {
            permPass = true;
            if (!command.allPerms_req) {
              break;
            }
          } else {
            permPass = false;
            if (command.allPerms_req) break;
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

      if (notPass === checks && checks) return 0;
      return 1;
    };
    if (!pass()) {
      notAuthorized(interaction);
      return;
    }
    // --NCheckAuth--

    try {
      await command.run(interaction);
      interaction.client.totalSuccessfullyInteractions++;
    } catch (error) {
      console.log(
        'Hubo un error ejecutando el comando "' +
          interaction.commandName +
          '":',
        error,
      );
      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.editReply({
            content: 'Hubo un error interno al ejecutar el comando.',
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: 'Hubo un error interno al ejecutar el comando.',
            ephemeral: true,
          });
        }
      } catch (error) {}
    }
  },
};
