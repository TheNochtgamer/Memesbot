const { Client, MessageEmbed } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = class LogMgr {
    /**
     * 
     * @param {Client} client 
     */
    async set(client) {
        this.client = client;
        this.mainGuild = this.client.guilds.cache.get(process.env.GUILDID);

        this.checkLogCh();
    }

    async checkLogCh() {
        if (!confi?.logChannelId) return console.log('Warn: Canal de logs no establecido');
        if (confi.logChannelId.length < 18 || isNaN(confi.logChannelId)) return console.log('Warn: Canal de logs establecido pero invalido');
        
        this.logCh = await this.client.channels.fetch(confi.logChannelId);
        if (!this.logCh.viewable) return console.log('Warn: Canal de logs establecido pero el bot no puede utilizarlo');
        console.log('Canal de logs establecido');
        return true;
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