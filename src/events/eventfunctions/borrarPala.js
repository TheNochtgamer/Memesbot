const { MessageReaction, User } = require("discord.js");

/**
 * @param {MessageReaction} reaction
 * @param {User} user
 * @returns
 */
module.exports = async function borrarPala(reaction, user) {
  const msg = reaction.message;
  if (
    reaction.emoji.name !== "❌" ||
    msg.interaction?.commandName !== "pala" ||
    msg.interaction?.user?.id !== user.id
  )
    return;

  try {
    await msg.delete();
  } catch (error) {
    console.log("Hubo un error al intentar borrar una pala:", error);
  }
};
