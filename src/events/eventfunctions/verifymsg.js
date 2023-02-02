const { MessageReaction, User, MessageActionRow, MessageEmbed, WebhookClient } = require('discord.js');
const moment = require("moment");
const timezones = require('moment-timezone');

const timeoutBut = require('../../commands/butTimeout.js').button();
const { sendWebHook, sleep, eNames, fixMoment } = require('../../utils');
const sendHash = require('./_sendHash');
const sendBackWebhook = require('./_sendBackWebhook');

const embed = new MessageEmbed().setColor('RED').setAuthor({ name: "Error" });

/**
 * @param {MessageReaction} reaction 
 * @param {User} user 
 * @returns 
 */
module.exports = async function verifymsg(reaction, user) {
    const client = reaction.client;
    const message = reaction.message;
    const channel = message.channel;
    const guild = message.guild;
    const endChannel = guild.channels.cache.get(confi.channelEndId);

    if (channel.id !== confi.channelStartId || !endChannel) return;

    try {
        await message.fetch();
    } catch (error) {
        console.log('Hubo un error fetching un mensaje:', error);
        return;
    }

    const botonTimeout = new MessageActionRow().addComponents(timeoutBut);
    const created = fixMoment(moment(message.createdTimestamp)).format('YY-MM-DD HH-mm-ss');
    const e = reaction.emoji;
    const author = message.author;
    const content = `\n${message.content?.replace(/@/gi, '@ ')}`;
    const files = message.attachments.map(attachment => attachment.attachment);
    const member = await guild.members.fetch(user.id);
    const canManageMessages = channel.permissionsFor(member.id).has("MANAGE_MESSAGES");
    const memberModRole = member.roles.cache.some((role) => role.id == confi.monderatorId);
    const memberVisitRole = member.roles.cache.some((role) => role.id == confi.visitorId);

    if (!(canManageMessages || memberModRole || memberVisitRole || author.id == reaction.client.user.id)) {
        reaction.users.remove(member.id);
        if (!(confi.replyMsg && reaction.client.timerAvailable())) return;

        embed.setDescription('No podes añadir reacciones en este canal ❌');
        logme.log(`${user.tag} no tiene permisos para añadir reacciones en el canal ${channel.name}`,
            `<@${user.id}> no tiene permisos añadir reacciones en el canal <#${channel.id}>`, user.id, '#FF0000');

        let s_message = await channel.send({ content: `<@${user.id}>`, embeds: [embed], components: [botonTimeout] });
        setTimeout(async _ => {
            try {
                if (s_message.deletable) await s_message.delete();
            } catch (error) { console.log('Hubo un error borrando un msg (0x1):', error) };
        }, 16000);

        return;
    }

    if (!(memberModRole || canManageMessages) || message.pinned || author?.bot) return;

    if (e.name == "❌" || e.name == "👎" || (e.name == "♻️") || e.id == eNames.disapprovedId) {
        if (!message.reactions.cache.get("♻️")?.me) sendHash(message);
        try {
            await message.delete();
            const sequelize = require('../../database');
            const Memes = require('../../database/models/memes')(sequelize);

            await Memes.create({
                type: 1,
                user_id: author.id,
                mod_id: member.id,
                created: created
            });
        } catch (error) {
            console.log('Hubo un error borrando un msg (0x2):', error);
            try {
                await reaction.users.remove(member.id);
            } catch (error) { }
            return;
        }
    }

    //TEST
    //if (user.id != user.client.owner) return;
    //

    if (!(e.name == "✅" || e.name == "👍" || e.id == eNames.approvedId)) return;

    if (confi.channelOpen == false) {
        reaction.users.remove(member.id);
        if (!(confi.replyMsg && client.timerAvailable())) return;
        embed.setDescription('El canal de memes esta cerrado ❌');

        let s_message = await channel.send({ content: `<@${user.id}>`, embeds: [embed] });
        setTimeout(async _ => {
            try {
                await s_message.delete();
            } catch (error) { console.log('Hubo un error borrando un msg (0x3):', error) };
        }, 16000);
        return;
    };

    if (confi.deleteApproved == true) {
        try {
            await message.delete();
        } catch (error) {
            console.log('Hubo un error borrando un msg (0x4):', error);
        }
    }

    let endMessage = await sendWebHook(endChannel, {
        username: author.username,
        avatarURL: author.avatarURL(),
        content: content,
        files: files,
    });

    try {
        const sequelize = require('../../database');
        const Memes = require('../../database/models/memes')(sequelize);

        Memes.create({
            msg_id: endMessage.id,
            user_id: author.id,
            mod_id: member.id,
            created: created
        });
    } catch (error) {
        console.log('Hubo un error al guardar un meme verificado:', error)
    }

    sendHash(message, endMessage);
    sendBackWebhook(message, endMessage, member);
};