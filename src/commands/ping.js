const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');

module.exports = {
    raw: true,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Te dice pong..'),
    // .setDefaultMemberPermissions(PFlags.VIEW_CHANNEL),
    //roles_req: ['958202026037239881', '965388862576816168'],
    //perms_req: ['ADMINISTRATOR'],
    //allRoles_req: false,
    //allPerms_req: false,
    //everthing_req: false,
    /**
     * @param {CommandInteraction} interaction 
     */
    async run(interaction) {
        const client = interaction.client;
        console.log('ping by', interaction.user.tag);

        if (interaction.user?.id != interaction.client.owner) {
            await interaction.reply({ content: `<@!${interaction.user.id}> - ${client.ws.ping}ms Pong!`, ephemeral: true });
        } else {
            const package = require('../../package.json');
            await interaction.reply({ content: `<@!${interaction.user.id}> - ${client.ws.ping}ms Pong!\n-Dev:\nVer: ${package.version}\nTotalInteractions: ${client.totalInteractions}\nTotalSuccessfullyInteractions: ${client.totalSuccessfullyInteractions}`, ephemeral: true });
        }
    },
};