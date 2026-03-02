const { SlashCommandBuilder } = require('discord.js');
const StoreService = require('../../services/StoreService');
const Embed = require('../../utils/Embed');

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('orders')
        .setDescription('View your purchase history.'),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const orders = await StoreService.getUserOrders(interaction.user.id);
        if (!orders.length) {
            return interaction.editReply({ embeds: [Embed.info('Orders', 'You have no orders.')] });
        }

        const lines = orders.map((o) => {
            const date = o.createdAt.toLocaleDateString();
            return `**${o.productName}** — $${o.price.toFixed(2)} — ${o.status} — ${date}`;
        });

        const embed = Embed.info('Your Orders', lines.join('\n'));
        await interaction.editReply({ embeds: [embed] });
    },
};
