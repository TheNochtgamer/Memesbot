const { Client, MessageEmbed } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = class LogMgr {

    /**
     * 
     * @param {Client} bot 
     */
    async set(bot) {
        this.bot = bot;
        this.mainGuild = this.bot.guilds.cache.get(process.env.GUILDID);
        if (confi?.logChannelId) {
            if (confi.logChannelId.length == 18 && !isNaN(confi.logChannelId)) {
                this.logCh = await this.bot.channels.fetch(confi.logChannelId);
                if (this.logCh.viewable) {
                    console.log('Canal de logs establecido');
                } else {
                    console.log('Warn: Canal de logs establecido pero el bot no puede utilizarlo');
                }
            } else {
                console.log('Warn: Canal de logs establecido pero invalido');
            }
        } else {
            console.log('Warn: Canal de logs no establecido');
        }
    }

    /**
     * @returns {boolean}
     */
    async checkLogCh() {
        if (confi.logChannelId) {
            if (confi.logChannelId.length == 18 && !isNaN(confi.logChannelId)) {
                this.logCh = await this.bot.channels.fetch(confi.logChannelId);
                if (this.logCh.viewable) {
                    console.log('Canal de logs establecido');
                    return true;
                } else {
                    console.log('Warn: Canal de logs establecido pero el bot no puede utilizarlo');
                    return false;
                }
            } else {
                console.log('Warn: Canal de logs establecido pero invalido');
                return false;
            }
        } else {
            console.log('Warn: Canal de logs no establecido');
            return false;
        }
    }

    /**
     * Funcion para enviar un nuevo log al canal de logs establecido
     * @param {String} message 
     * @param {String | Boolean} toLogs 
     * @param {String} embedFooter
     * @param {String} color
     */
    log(message, toLogs, embedFooter, color) {
        if (!message) return;
        console.log(message);

        if (!toLogs) return;
        const embed = new MessageEmbed()
            .setDescription(message)
            .setColor(color || randomColor())
            .setTimestamp();
        if (typeof toLogs != "boolean") { embed.setDescription(toLogs) };
        if (this.mainGuild?.iconURL()) { embed.setAuthor({ iconURL: this.mainGuild.iconURL(), name: this.mainGuild.name }) } else { embed.setAuthor({ name: this.mainGuild.name }) };
        if (embedFooter) embed.setFooter({ text: embedFooter });
        if (this.logCh) {
            this.logCh.send({ embeds: [embed] });
        }
    }
}