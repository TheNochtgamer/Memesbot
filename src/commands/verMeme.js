const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, ContextMenuInteraction, MessageButton, MessageActionRow } = require('discord.js');
const userBut = new MessageButton()
    .setCustomId('userbut')
    .setLabel('User')
    .setStyle('PRIMARY');
const modBut = new MessageButton()
    .setCustomId('modbut')
    .setLabel('Mod')
    .setStyle('SUCCESS');
const hashBut = new MessageButton()
    .setCustomId('gethash')
    .setLabel('GetHash')
    .setStyle('DANGER');
const moment = require('moment');
const randomColor = require('randomcolor');
const { getSql, fixMoment } = require('../utils');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Check Meme')
        .setType(3),
    roles_req: [confi.monderatorId, '804900054153560084'],
    perms_req: ['MANAGE_MESSAGES'],
    /**
     * @param {ContextMenuInteraction} interaction 
     * @returns 
     */
    async run(interaction) {
        const targetId = interaction.targetId;

        if (!(confi.channelEndId == interaction.channelId)) {
            interaction.reply({ content: 'Este comando solo se puede usar en el canal de memes' + (confi.channelEndId ? `: <#${confi.channelEndId}>` : ''), ephemeral: true });
            return;
        }

        await interaction.reply({ content: `Buscando mensaje...`, ephemeral: true });
        let interactionReply = await interaction.fetchReply();
        //const sql = "SELECT * FROM `memes` WHERE `msg_id`='" + interaction.targetId + "'";        let result;

        let result;
        try {
            const sequelize = require('../database');
            const Memes = require('../database/models/memes')(sequelize);
            result = await Memes.findOne({
                where: {
                    msg_id: targetId
                },
                raw: true
            });
        } catch (error) {
            console.log("Hubo un error al intentar leer la base de datos:", error)
            interaction.editReply({ content: `Hubo un error al intentar leer la base de datos`, ephemeral: true });
            return;
        }

        if (!result) {
            interaction.editReply({ content: `No se encontro el mensaje en la base de datos`, ephemeral: true });
            return;
        }

        const msgTimestamp = fixMoment(moment(result.verified));
        const msgCreatedTimestamp = fixMoment(moment(result.created), true);
        let message;
        let linkButton;
        try {
            message = await interaction.channel.messages.fetch(targetId);
            linkButton = new MessageButton()
                .setLabel('Volver')
                .setURL(message.url)
                .setStyle('LINK');
        } catch (error) {
            console.log("Hubo un error al intentar encontrar un msg (checkmeme0):", error)
        }
        const botonera = new MessageActionRow()
            .addComponents(
                userBut,
                modBut,
                (linkButton ? linkButton : ''),
                (interaction.user.id == interaction.client.owner ? hashBut : '')
            );
        const filter = i => i.user.id === interaction.user.id && i.message.id == interactionReply.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15 * 60 * 1000 });

        const embed = new MessageEmbed()
            .setColor(randomColor())
            .setTitle('Ver Meme')
            .addFields(
                { name: 'Enviado por:', value: `<@!${result.user_id}> [${result.user_id}]`, inline: false },
                { name: 'Verificado por:', value: `<@!${result.mod_id}> [${result.mod_id}]`, inline: false },
                { name: 'Verificado el:', value: `${msgTimestamp.format('DD/MM/YY HH:mm')}\n<t:${msgTimestamp.unix()}:R>`, inline: true },
            )
            .setFooter({ text: interaction.client.user.username })
            .setTimestamp();

        if (result.created) {
            embed.addField('Enviado el:', `${msgCreatedTimestamp.format('DD/MM/YY HH:mm')}\n<t:${msgCreatedTimestamp.unix()}:R>`, true);
        }
        if (interaction.member.id == interaction.client.owner) {
            embed.addField('databaseID', 'ID=' + result.ID, false);
        };

        try {
            await interaction.editReply({ content: '_ _', embeds: [embed], ephemeral: true, components: [botonera] });

        } catch (error) {
            console.log('Hubo un error al intentar responder un msg:', error)
            return;
        }

        collector.on('collect', async butInteraction => {
            if (butInteraction.customId == userBut.customId) {
                await butInteraction.reply({ content: `<@!${result.user_id}>`, ephemeral: true });
            } else if (butInteraction.customId == modBut.customId) {
                await butInteraction.reply({ content: `<@!${result.mod_id}>`, ephemeral: true });
            } else {
                let res;
                try {
                    const sequelize = require('../database');
                    const Hashes = require('../database/models/hashes')(sequelize);
                    res = await Hashes.findAll({
                        where: {
                            msg_id: targetId
                        },
                        raw: true
                    });
                } catch (error) {
                    await butInteraction.reply({ content: 'Hubo un error al intentar leer la base de datos', ephemeral: true });
                    return;
                }

                let hashes = '';
                res.forEach((rawModel, index) => {
                    hashes += `-**${index + 1}**: ` + rawModel.hash + '\n';
                });

                const embed2 = new MessageEmbed()
                    .setColor('DARK_RED')
                    .setTitle('Hashes en este mensaje')
                    .setDescription(hashes || 'Ningun hash fue creado a partir de este mensaje.')
                    .setFooter({ text: interaction.client.user.username })
                    .setTimestamp();

                await butInteraction.reply({ embeds: [embed2], ephemeral: true });
            }
        });

    },
};