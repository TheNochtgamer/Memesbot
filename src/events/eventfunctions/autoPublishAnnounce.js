const { Message } = require("discord.js");

/**
 * @param {Message} message
 * @returns
*/
module.exports = async function autopublishannounce(message) {
    if (!message.crosspostable) return;
    
    try {
        await message.crosspost();
    } catch (error) {
        console.log('Hubo un error al intentar publicar un mensaje:', error);
        return;
    }
}