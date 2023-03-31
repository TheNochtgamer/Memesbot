/* eslint-disable eqeqeq */
const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");
const { save } = require("../utils/configMgr.js");
const { confi, logme, PFlags } = require("../utils/index.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("change")
    .setDescription("Dev")
    .setDefaultMemberPermissions(PFlags.ADMINISTRATOR)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Cambiar un valor de la configuracion")
        .addStringOption((option) =>
          option
            .setName("variable")
            .setDescription("Valores")
            .setRequired(true)
            .addChoices(
              { name: "memeStartId", value: "0" },
              { name: "memeEndId", value: "1" },
              { name: "moderatorId", value: "2" },
              { name: "visitorId", value: "3" },
              { name: "replyMsg", value: "4" },
              { name: "deleteAproved", value: "5" },
              { name: "reactionAdd", value: "6" },
              { name: "deleteNotAuth", value: "7" },
              { name: "logChannelId", value: "8" },
              { name: "channelClipsId", value: "9" },
              { name: "numericReact", value: "10" },
              { name: "memeRepetidoReact", value: "11" },
              { name: "autoPublishAnnounces", value: "12" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("valor")
            .setDescription("Nuevo valor")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("get")
        .setDescription("Recibe el valor de una configuracion")
        .addStringOption((option) =>
          option
            .setName("variable")
            .setDescription("Valores")
            .setRequired(true)
            .addChoices(
              { name: "memeStartId", value: "0" },
              { name: "memeEndId", value: "1" },
              { name: "moderatorId", value: "2" },
              { name: "visitorId", value: "3" },
              { name: "replyMsg", value: "4" },
              { name: "deleteAproved", value: "5" },
              { name: "reactionAdd", value: "6" },
              { name: "deleteNotAuth", value: "7" },
              { name: "logChannelId", value: "8" },
              { name: "channelClipsId", value: "9" },
              { name: "numericReact", value: "10" },
              { name: "memeRepetidoReact", value: "11" },
              { name: "autoPublishAnnounces", value: "12" }
            )
        )
    ),
  perms_req: ["ADMINISTRATOR"],
  /**
   * @param {CommandInteraction} interaction
   * @returns
   */
  async run(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const var0 = interaction.options.getString("variable");
    const sub = interaction.options.getSubcommand();
    let InteractDefRly = true;

    if (sub === "get") {
      let toGet;
      switch (var0) {
        case "0":
          toGet = confi.channelStartId + ` <#${confi.channelStartId}>`;
          break;
        case "1":
          toGet = confi.channelEndId + ` <#${confi.channelEndId}>`;
          break;
        case "2":
          toGet = confi.monderatorId + ` <@&${confi.monderatorId}>`;
          break;
        case "3":
          toGet = confi.visitorId + ` <@&${confi.visitorId}>`;
          break;
        case "4":
          toGet = confi.replyMsg;
          break;
        case "5":
          toGet = confi.deleteApproved;
          break;
        case "6":
          toGet = confi.addReaction;
          break;
        case "7":
          toGet = confi.deleteNotAuth;
          break;
        case "8":
          toGet = confi.logChannelId + ` <#${confi.logChannelId}>`;
          break;
        case "9":
          toGet = confi.channelClipsId + ` <#${confi.channelClipsId}>`;
          break;
        case "10":
          toGet = confi.numericReact;
          break;
        case "11":
          toGet = confi.memeRepetidoReact;
          break;
        case "12":
          toGet = confi.autoPublishAnnounces;
          break;
      }

      if (InteractDefRly == true)
        interaction.editReply({
          content: `Configuracion: ${toGet}`,
          ephemeral: true,
        });
    }

    if (sub === "set") {
      const var1 = interaction.options.getString("valor");

      switch (var0) {
        case "0":
          confi.channelStartId = var1;
          break;
        case "1":
          confi.channelEndId = var1;
          break;
        case "2":
          confi.monderatorId = var1;
          break;
        case "3":
          confi.visitorId = var1;
          break;
        case "4":
          if (var1 == "true" || var1 == "false") {
            confi.replyMsg = JSON.parse(var1);
          } else {
            InteractDefRly = false;
            interaction.editReply({
              content: `No se actualizo la configuracion, el "valor" debe ser boolean`,
              ephemeral: true,
            });
          }
          break;
        case "5":
          if (var1 == "true" || var1 == "false") {
            confi.deleteApproved = JSON.parse(var1);
          } else {
            InteractDefRly = false;
            interaction.editReply({
              content: `No se actualizo la configuracion, el "valor" debe ser boolean`,
              ephemeral: true,
            });
          }
          break;
        case "6":
          if (var1 == "true" || var1 == "false") {
            confi.addReaction = JSON.parse(var1);
          } else {
            InteractDefRly = false;
            interaction.editReply({
              content: `No se actualizo la configuracion, el "valor" debe ser boolean`,
              ephemeral: true,
            });
          }
          break;
        case "7":
          if (var1 == "true" || var1 == "false") {
            confi.deleteNotAuth = JSON.parse(var1);
          } else {
            InteractDefRly = false;
            interaction.editReply({
              content: `No se actualizo la configuracion, el "valor" debe ser boolean`,
              ephemeral: true,
            });
          }
          break;
        case "8":
          confi.logChannelId = var1;
          logme.checkLogCh();
          break;
        case "9":
          confi.channelClipsId = var1;
          break;
        case "10":
          if (var1 == "true" || var1 == "false") {
            confi.numericReact = JSON.parse(var1);
          } else {
            InteractDefRly = false;
            interaction.editReply({
              content: `No se actualizo la configuracion, el "valor" debe ser boolean`,
              ephemeral: true,
            });
          }
          break;
        case "11":
          if (var1 == "true" || var1 == "false") {
            confi.memeRepetidoReact = JSON.parse(var1);
          } else {
            InteractDefRly = false;
            interaction.editReply({
              content: `No se actualizo la configuracion, el "valor" debe ser boolean`,
              ephemeral: true,
            });
          }
          break;
        case "12":
          if (var1 == "true" || var1 == "false") {
            confi.autoPublishAnnounces = JSON.parse(var1);
          } else {
            InteractDefRly = false;
            interaction.editReply({
              content: `No se actualizo la configuracion, el "valor" debe ser boolean`,
              ephemeral: true,
            });
          }
          break;
      }

      // const confis = JSON.stringify(confi);
      // fs.writeFileSync('./config.json', confis);
      if (InteractDefRly === true) {
        const sRes = await save();
        if (sRes.success) {
          console.log(`//Config//= Cambio (${var0}) de (${var1})`);
          interaction.editReply({
            content: `Configuracion actualizada`,
            ephemeral: true,
          });
        } else {
          console.log(`//Config//= Cambio (${var0}) de (${var1})`);
          console.log(
            "Hubo un error al intentar cambiar la configuracion:",
            sRes.err
          );
          interaction.editReply({
            content:
              `Se actualizo la configuracion pero no se guardo, hubo un error con la base de datos\n` +
              "```\n" +
              sRes.err +
              "```",
            ephemeral: true,
          });
        }
      }
    }
  },
};
