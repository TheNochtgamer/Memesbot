const {
  MessageReaction,
  User,
  ActionRowBuilder,
  EmbedBuilder,
  WebhookClient,
} = require('discord.js');
const moment = require('moment');
const {
  sendWebHook,
  sleep,
  eNames,
  fixMoment,
  confi,
  logme,
} = require('../utils');
const sendHash = require('./_sendHash');
const sendBackWebhook = require('./_sendBackWebhook');
const timeoutBut = require('../commands/butTimeout.js').button();

/**
 * @param {MessageReaction} reaction
 * @param {User} user
 * @returns
 */
module.exports = async function verifymsg(reaction, user) {
  const client = reaction.client;
  const message = reaction.message;
  const channel = message.channel;
  const endChannel = message.guild?.channels?.cache?.get(confi.channelEndId);
  const errEmbed = new EmbedBuilder()
    .setColor('Red')
    .setAuthor({ name: 'Error' })
    .setDescription('null');

  if (channel.id !== confi.channelStartId || !endChannel) return;

  const [{ value: member }, promiseStatus] = await Promise.allSettled([
    message.guild.members.fetch(user.id),
    message.fetch(),
  ]);

  if (promiseStatus.status === 'rejected') {
    console.log('Hubo un error fetching un mensaje:', promiseStatus.reason);
    return;
  }

  const botonTimeout = new ActionRowBuilder().addComponents(timeoutBut);
  const created = fixMoment(moment(message.createdTimestamp)).format(
    'YY-MM-DD HH-mm-ss',
  );
  const reactEName = reaction.emoji.name;
  const author = message.author;
  const content = `${message.content?.replace(/@/gi, '@ ')}` || null;
  const files = message.attachments.map(attachment => attachment.attachment);
  const canManageMessages = channel
    .permissionsFor(member.id)
    .has('MANAGE_MESSAGES');
  const memberModRole = member.roles.cache.some(
    role => role.id === confi.monderatorId,
  );
  const memberVisitRole = member.roles.cache.some(
    role => role.id === confi.visitorId,
  );

  if (
    !(
      canManageMessages ||
      memberModRole ||
      memberVisitRole ||
      author.id === reaction.client.user.id
    )
  ) {
    if (!(confi.replyMsg && reaction.client.timerAvailable())) return;

    errEmbed.setDescription('No podes añadir reacciones en este canal ❌');
    logme.log(
      `${user.tag} no tiene permisos para añadir reacciones en el canal ${channel.name}`,
      `<@${user.id}> no tiene permisos para añadir reacciones en el canal <#${channel.id}>`,
      user.id,
      '#FF0000',
    );

    const replyMsg = await channel.send({
      content: `<@${user.id}>`,
      embeds: [errEmbed],
      components: [botonTimeout],
    });
    setTimeout(async _ => {
      try {
        if (replyMsg.deletable) await replyMsg.delete();
      } catch (error) {
        console.log('Hubo un error borrando un msg (0x1):', error);
      }
    }, 16000);
    return;
  }

  if (!(memberModRole || canManageMessages) || message.pinned || author?.bot)
    return;

  if (
    reactEName === '❌' ||
    reactEName === '👎' ||
    reactEName === '♻️' ||
    eNames.disapproved.includes(reactEName)
  ) {
    sendHash(message);

    const { Memes } = require('../database');

    const values = await Promise.allSettled([
      Memes.create({
        type: 1,
        user_id: author.id,
        mod_id: member.id,
        created,
      }),
      message.delete(),
    ]);

    if (values[0].status === 'rejected')
      console.log('Hubo un error en la base de datos:', values[0].reason);
    if (values[1].status === 'rejected')
      console.log('Hubo un error borrando un msg (0x2):', values[1].reason);
    return;
  }

  if (
    !(
      reactEName === '✅' ||
      reactEName === '👍' ||
      eNames.approved.includes(reactEName)
    )
  )
    return;

  if (!confi.channelOpen) {
    errEmbed.setDescription('El canal de memes esta cerrado ❌');
    const promises = [reaction.users.remove(member.id)];
    if (confi.replyMsg && client.timerAvailable())
      promises.push(
        channel.send({ content: `<@${user.id}>`, embeds: [errEmbed] }),
      );
    const values = await Promise.allSettled(promises);

    if (values.at(1)?.value) {
      setTimeout(async _ => {
        try {
          await values.at(1).value.delete();
        } catch (error) {
          console.log('Hubo un error borrando un msg (0x3):', error);
        }
      }, 16000);
    }
    return;
  }

  if (confi.deleteApproved) {
    try {
      await message.delete();
    } catch (error) {
      console.log('Hubo un error borrando un msg (0x4):', error);
    }
  }

  const endMessage = await sendWebHook(endChannel, {
    username: author.username,
    avatarURL: author.avatarURL(),
    content,
    files,
  });

  try {
    const { Memes } = require('../database');
    // const Memes = require('../../database/models/memes')(sequelize);

    await Memes.create({
      msg_id: endMessage.id,
      user_id: author.id,
      mod_id: member.id,
      created,
    });
  } catch (error) {
    console.log('Hubo un error al guardar un meme verificado:', error);
  }

  sendHash(message, endMessage);
  sendBackWebhook(message, endMessage, member);
};

