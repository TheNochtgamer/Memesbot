const { verifymsg, borrarPala } = require("./eventfunctions");

module.exports = {
  name: "messageReactionAdd",
  async run(reaction, user) {
    if (user.bot) return;

    verifymsg(reaction, user);
    borrarPala(reaction, user);
  },
};
