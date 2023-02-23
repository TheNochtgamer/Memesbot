const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed, Presence } = require('discord.js');
const moment = require('moment');
let statsCache = { 'timeout': moment().subtract(60, 's'), 'value': null };

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Ver las estadisticas de memes')
        .addStringOption(option => option
            .setName('durante')
            .setDescription('Hace cuanto tiempo se mostraran las estadisticas') // TODO cambiar la descripcion y el nombre por otra cosa mas entendible
            .setChoices(
                { 'name': '24h', 'value': '1' },
                { 'name': '7d', 'value': '7' }
            ))
    ,
    perms_req: ['MANAGE_MESSAGES'],
    /**
     * @param {CommandInteraction} interaction 
     */
    async run(interaction) {
        const now = moment();
        const inTime = 24 * (interaction.options.getString('despues') || 1);
        const embed = new MessageEmbed().setAuthor({ 'name': `${interaction.guild.name} Stats`, 'iconURL': interaction.guild.iconURL() })
            .setColor('RANDOM')
            .setFooter({ 'text': interaction.client.user.username })
            .setDescription('Buscando en la base de datos...')
            .setTimestamp();

        await interaction.reply({ 'embeds': [embed], 'ephemeral': true });

        let isCacheAvaliable = moment(statsCache?.timeout).diff(now, 's') > -60;
        let result = isCacheAvaliable ? statsCache?.value : null;
        if (!result) {
            try {
                const sequelize = require('../database');
                const Memes = require('../database/models/memes')(sequelize);
                result = await Memes.findAll({
                    raw: true
                });
                statsCache = { 'timeout': now, 'value': result };
            } catch (error) {
                console.log("Hubo un error al intentar leer la base de datos:", error);
                embed.setDescription('Hubo un error al intentar leer la base de datos.');
                await interaction.editReply({ 'embeds': [embed], 'ephemeral': true });
                return;
            }
        }

        embed.setDescription('Analizando informacion...');
        await interaction.editReply({ 'embeds': [embed], 'ephemeral': true });

        let verifiedInTime = result.reduce((prev, meme) => {
            if (now.diff(moment(meme.verified), 'h') <= inTime && !meme.type) prev++;
            return prev;
        }, 0);
        let deletedInTime = result.reduce((prev, meme) => {
            if (now.diff(moment(meme.verified), 'h') <= inTime && !!meme.type) prev++;
            return prev;
        }, 0);
        // let lastVerified = moment(result.reverse().some(meme => meme.type == 0 && meme.verified)?.verified);

        let lastVerified = result.reduce((prev, meme) => {
            if (!meme.verified) return prev;
            if (!prev) prev = moment(meme.verified);
            if (!meme.type && prev.diff(moment(meme.verified), 's') < 0) {
                prev = moment(meme.verified);
            }
            return prev;
        }, null);

        let lastDeleted = result.reduce((prev, meme) => {
            if (!meme.verified) return prev;
            if (!prev) prev = moment(meme.verified);
            if (!!meme.type && prev.diff(moment(meme.verified), 's') < 0) {
                prev = moment(meme.verified);
            }
            return prev;
        }, null);

        embed.addFields(
            { 'name': '📝Verificados:', 'value': `**${verifiedInTime}**`, 'inline': true },
            { 'name': '❌Eliminados:', 'value': `**${deletedInTime}**`, 'inline': true },
            { 'name': '_ _', 'value': '_ _' },
            { 'name': '🕐Ultimo Verificado:', 'value': `<t:${lastVerified?.unix()}:R>`, 'inline': true },
            { 'name': '🕦Ultimo Eliminado:', 'value': `<t:${lastDeleted?.unix()}:R>`, 'inline': true },
        ).setDescription(' ').setTitle(`Estadisticas ${(interaction.options.getString('despues') || 1)}d:`);;
        return interaction.editReply({ embeds: [embed] });
    },
};