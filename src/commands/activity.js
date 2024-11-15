const {
  CommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require('discord.js');
const { save } = require('../utils/configMgr.js');
const { confi } = require('../utils/index.js');
const { ActivityType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('activity')
    .setDescription('Establece la actividad actual del bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand(subcommand =>
      subcommand
        .setName('set')
        .setDescription('Establece la actividad actual del bot')
        .addStringOption(option =>
          option
            .setName('actividad')
            .setDescription('El nombre de la actividad')
            .setRequired(true),
        )
        .addStringOption(option =>
          option
            .setName('type')
            .setDescription('El tipo de la actividad')
            .addChoices(
              { name: 'COMPETING', value: 'Competing' },
              { name: 'LISTENING', value: 'Listening' },
              { name: 'PLAYING', value: 'Playing' },
              { name: 'STREAMING', value: 'Streaming' },
              { name: 'WATCHING', value: 'Watching' },
            ),
        )
        .addStringOption(option =>
          option
            .setName('url')
            .setDescription(
              'En caso de que la actividad sea "STREAMING" colocar un link de twitch',
            ),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('reset')
        .setDescription('Borra la actividad actual del bot'),
    ),
  // perms_req: ['MANAGE_MESSAGES'],
  /**
   *
   * @param {CommandInteraction} interaction
   * @returns
   */
  async run(interaction) {
    const subCom = interaction.options.getSubcommand();

    if (subCom === 'reset') {
      confi.activity0 = '';
      confi.activity1 = '';
      confi.activity2 = '';

      // interaction.client.user.setActivity('');
      interaction.client.user.setPresence({ activities: null });

      const sRes = await save();
      if (sRes.success) {
        console.log(`Actividad del bot reseteada por ${interaction.user.tag}`);
        interaction.reply({ content: `Actividad reiniciada`, ephemeral: true });
      } else {
        console.log(
          'Hubo un error al intentar guardar la configuracion (activity 0x0):',
          sRes.err,
        );
        interaction.reply({
          content: `Actividad reiniciada, pero no se pudo guardar`,
          ephemeral: true,
        });
      }
    } else if (subCom === 'set') {
      const var0 = interaction.options.get('actividad', true).value;
      const var1 = interaction.options.get('type')?.value;
      const var2 = interaction.options.get('url')?.value;

      try {
        interaction.client.user.setPresence({
          activities: [{ name: var0, type: ActivityType[var1], url: var2 }],
        });
        confi.activity0 = var0;
        confi.activity1 = var1;
        confi.activity2 = var2;
      } catch (error) {
        console.log(
          'Hubo un error al intentar actualizar la actividad:',
          error,
        );
        interaction.reply({
          content: `Hubo un error al intentar actualizar la actividad`,
          ephemeral: true,
        });
        return;
      }

      interaction.reply({ content: `Actividad actualizada`, ephemeral: true });

      const sRes = await save();
      if (sRes.success) {
        console.log(
          `Actividad del bot actualizada por ${interaction.user.tag}`,
        );
      } else {
        console.log(
          'Hubo un error al intentar guardar la configuracion (activity 0x1):',
          sRes.err,
        );
      }
    }
  },
};

