const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, CommandInteraction } = require('discord.js');
const { getSql, fixMoment, eNames } = require('../utils');
const moment = require('moment');
const randomColor = require('randomcolor');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkuser')
        .setDescription('Comando para ver la estadisticas de alguien')
        .addUserOption(option => option.setName('user')
            .setRequired(true)
            .setDescription("Miembro a ver las estadisticas")),
    roles_req: [confi.monderatorId, '804900054153560084'],
    perms_req: ['MANAGE_MESSAGES'],
    /**
     * @param {CommandInteraction} interaction 
     * @returns 
     */
    async run(interaction) {
        const user = interaction.options.getUser('user', true);
        const ahora = fixMoment(moment());
        const embed = new MessageEmbed()
            .setDescription('Buscando en la base de datos...')
            .setColor(randomColor())
            .setFooter({ text: interaction.client.user.username })
            .setTimestamp();

        if (!user) {
            embed.setAuthor({ name: 'Error' })
                .setDescription('Hubo un error inesperado, no se declaro el "user"')
                .setColor('RED');
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        };

        if (user.id == interaction.client.user.id) {
            embed.setAuthor({ name: 'Error' })
                .setDescription('Acaso crees que tengo algun dato propio?\n -Porfavor elija otro usuario.')
                .setColor('RED');
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        if (user.bot) {
            embed.setAuthor({ name: 'Error' })
                .setDescription('Estas buscando datos de un bot y por si no sabias, los bots no mandan memes 🙄\n -Porfavor elija otro usuario.')
                .setColor('RED');
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        console.log(`${interaction.user.tag} reviso al miembro ${user.tag}`);

        if (user.avatarURL()) {
            embed.setAuthor({ name: user.tag, iconURL: user.avatarURL() });
        } else {
            embed.setAuthor({ name: user.tag });
        }
        await interaction.reply({ embeds: [embed], ephemeral: true });

        //const sql = "SELECT * FROM `memes` WHERE `user_id` = '" + user.id + "' ORDER BY `ID` DESC";
        //const sql1 = "SELECT * FROM `memes` WHERE `mod_id` = '" + user.id + "' ORDER BY `ID` DESC";
        //siglas: meme Enviado True
        let mET = 0;
        //siglas: meme Enviado False
        let mEF = 0;
        //siglas: meme Enviado True Hoy
        let mETH = 0;
        let mEFH = 0;
        //siglas: meme Revisado True
        let mRT = 0;
        let mRF = 0;
        //siglas: meme Revisado True Hoy
        let mRTH = 0;
        let mRFH = 0;

        let res = [], res1 = [];
        try {
            const sequelize = require('../database');
            const Memes = require('../database/models/memes')(sequelize);
            res = await Memes.findAll({
                where: {
                    user_id: user.id
                },
                raw: true
            });
            res1 = await Memes.findAll({
                where: {
                    mod_id: user.id
                },
                raw: true
            });
            //res = await getSql(sql);
        } catch (error) {
            embed.setAuthor({ name: 'Error' })
                .setDescription('Hubo un error con la base de datos')
                .setColor('RED');
            console.log('Hubo un error con la base de datos 0x1:', error);
            interaction.editReply({ embeds: [embed], ephemeral: true });
            return;
        }
        let existdata = res.length != 0 || res1.length != 0;

        if (existdata) {
            embed.setDescription('Analizando la informacion....');
            await interaction.editReply({ embeds: [embed], ephemeral: true });
        }

        embed.setDescription('').setTitle('Estadisticas:');
        if (res.length != 0) {
            let lastMoment, first = false;
            res.forEach(data => {
                const verified = fixMoment(moment(data.verified));
                if (data.type == 0) {
                    mET++;
                    if (ahora.diff(verified, 'hours') <= 24) mETH++;
                } else {
                    mEF++;
                    if (ahora.diff(verified, 'hours') <= 24) mEFH++;
                }

                if (!first) {
                    lastMoment = verified;
                    first = true;
                } else {
                    if (lastMoment.diff(verified, 'second') < 0) {
                        lastMoment = verified;
                    }
                }
            });

            // meme Enviado All
            let mEA = mET + mEF;
            let mEAH = mETH + mEFH;

            embed.addFields(
                { name: "📨Memes Enviados:", value: mET + eNames.approved + " + " + mEF + eNames.disapproved + " = " + mEA, inline: true },
                { name: "📨Memes Enviados (24h):", value: mETH + eNames.approved + " + " + mEFH + eNames.disapproved + " = " + mEAH, inline: true },
                { name: "🕐Ultimo meme Enviado:", value: `<t:${lastMoment.unix()}:R>`, inline: true }
            );
        }
        if (res1.length != 0) {
            if (res.length != 0) embed.addFields({'name': '_ _', 'value': '_ _'});
            let lastMoment, first = false;
            res1.forEach(data => {
                const verified = fixMoment(moment(data.verified));
                if (data.type == 0) {
                    mRT++;
                    if (ahora.diff(verified, 'hours') <= 24) mRTH++;
                } else {
                    mRF++;
                    if (ahora.diff(verified, 'hours') <= 24) mRFH++;
                }

                if (!first) {
                    lastMoment = verified;
                    first = true;
                } else {
                    if (lastMoment.diff(verified, 'second') < 0) {
                        lastMoment = verified;
                    }
                }
            });

            let mRA = mRT + mRF;
            let mRAH = mRTH + mRFH;

            embed.addFields(
                { name: "📝Memes Revisados:", value: mRT + eNames.approved + " + " + mRF + eNames.disapproved + " = " + mRA, inline: true },
                { name: "📝Memes Revisados (24h):", value: mRTH + eNames.approved + " + " + mRFH + eNames.disapproved + " = " + mRAH, inline: true },
                { name: "🕐Ultimo meme Revisado:", value: `<t:${lastMoment.unix()}:R>`, inline: true }
            );
        }
        if (!existdata) {
            embed.setDescription('No se encontraron datos :/');
        }

        await interaction.editReply({ embeds: [embed], ephemeral: true });
    },
};