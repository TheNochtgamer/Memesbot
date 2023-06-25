const { verifymsg, borrarPala } = require('../handlers');

module.exports = {
  name: 'messageReactionAdd',
  async run(reaction, user) {
    if (user.bot) return;

    verifymsg(reaction, user);
    borrarPala(reaction, user);
  },
};
