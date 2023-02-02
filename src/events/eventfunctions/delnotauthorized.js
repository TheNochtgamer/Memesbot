const { Message, MessageActionRow, MessageEmbed } = require("discord.js");
const timeoutBut = require('../../commands/butTimeout.js').button();

/**
 * @param {Message} message
 * @returns
*/
module.exports = async function delnotauthorized(message) {

    const channel = message.channel;
    if (confi.channelStartId != channel.id) {
        return;
    };

    if (message.attachments.size != 0 || message.content.includes('https://')) return;

    const author = message.author;
    const guild = message.guild;
    const member = await guild.members.fetch(author.id);
    const memberPerms = channel.permissionsFor(member.id);
    const canManageMessages = memberPerms.has("MANAGE_MESSAGES");
    const memberModRole = member.roles.cache.some((role) => role.id == confi.monderatorId);
    const bot = message.client;
    const compRow = new MessageActionRow().addComponents(timeoutBut);
    if (canManageMessages || memberModRole) return;


    try {
        if (message.deletable) await message.delete();
    } catch (error) {
        console.log('Hubo un error borrando un msg no autorizado:', error);
        return;
    }

    if (!confi.replyMsg) return;
    if (!bot.timerAvailable()) return;

    logme.log(`${author.tag} no tiene permisos para mandar un comentario en el canal ${channel.name}`, `<@${author.id}> no tiene permisos para mandar un comentario en el canal <#${channel.id}>`, author.id, '#FF0000');

    const embed = new MessageEmbed().setColor('RED').setDescription('**No** tenes permisos para enviar comentarios en este canal ❌').setAuthor({ name: "Error" });

    channel.send({ content: `<@${author.id}>`, embeds: [embed], components: [compRow] }).then(msg => setTimeout(async () => {
        try {
            await msg.delete();
        } catch (error) {
            console.log('Hubo un error borrando un msg:', error);
            return;
        }
    }, 16000));
}