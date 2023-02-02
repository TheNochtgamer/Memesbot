const { Message } = require("discord.js");

/**
 * @param {Message} message
 * @returns
*/
module.exports = async function secret(message) {
    if (message.content.toLowerCase() == "memebot123") {
        if (global.secretVal) return;
        try {
            globalThis.secretVal = 1;
            await message.channel.send({ content: `<@${message.author.id}> Encontraste un easter egg 😮` });
            secretVal = 1;
            await message.delete();
        } catch (error) { }
        setTimeout(_ => globalThis.secretVal = 0, 60 * 1000);
        return;
    };
}