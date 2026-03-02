const { Events, InteractionType } = require('discord.js');
const Embed = require('../utils/Embed');
const TicketService = require('../services/TicketService');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;

            const cooldowns = interaction.client.cooldowns;
            const cooldownKey = `${interaction.commandName}_${interaction.user.id}`;
            const cooldownAmount = (command.cooldown || 3) * 1000;

            if (cooldowns.has(cooldownKey)) {
                const expiry = cooldowns.get(cooldownKey);
                if (Date.now() < expiry) {
                    const remaining = ((expiry - Date.now()) / 1000).toFixed(1);
                    return interaction.reply({
                        embeds: [Embed.error(`Please wait ${remaining}s before using this command again.`)],
                        ephemeral: true,
                    });
                }
            }

            cooldowns.set(cooldownKey, Date.now() + cooldownAmount);
            setTimeout(() => cooldowns.delete(cooldownKey), cooldownAmount);

            try {
                await command.execute(interaction);
            } catch (err) {
                console.error(`[Command Error] ${interaction.commandName}:`, err);
                const reply = { embeds: [Embed.error('An error occurred.')], ephemeral: true };
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(reply);
                } else {
                    await interaction.reply(reply);
                }
            }
        }

        if (interaction.isButton()) {
            const customId = interaction.customId;

            if (customId.startsWith('ticket_close_')) {
                const ticketId = customId.replace('ticket_close_', '');
                const result = await TicketService.close(ticketId, interaction.user.id, interaction.guild);
                if (!result.success) {
                    return interaction.reply({ embeds: [Embed.error(result.error)], ephemeral: true });
                }
                await interaction.reply({ embeds: [Embed.success('Ticket Closed', 'This ticket is being closed.')], ephemeral: true });
            }
        }
    },
};
