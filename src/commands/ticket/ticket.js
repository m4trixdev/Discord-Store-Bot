const { SlashCommandBuilder } = require('discord.js');
const TicketService = require('../../services/TicketService');
const Embed = require('../../utils/Embed');

module.exports = {
    cooldown: 30,
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Open a support ticket.')
        .addStringOption((opt) =>
            opt.setName('reason').setDescription('Reason for the ticket.').setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const reason = interaction.options.getString('reason');
        const result = await TicketService.open(interaction.guild, interaction.user, reason);

        if (!result.success) {
            return interaction.editReply({ embeds: [Embed.error(result.error)] });
        }

        await interaction.editReply({
            embeds: [Embed.success('Ticket Opened', `Your ticket has been created: ${result.channel}`)],
        });
    },
};
