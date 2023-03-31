const { Client } = require("discord.js");

module.exports = {
  name: "ready",
  /**
   * @param {Client} bot
   */
  run(bot) {
    console.log(`Online como ${bot.user.tag}`);
  },
};
