const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const StoreService = require('../../services/StoreService');
const Embed = require('../../utils/Embed');

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('products')
        .setDescription('List available products in the store.'),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const products = await StoreService.getProducts();
        if (!products.length) {
            return interaction.editReply({ embeds: [Embed.info('Store', 'No products available at the moment.')] });
        }

        for (const product of products) {
            const embed = Embed.product(product);
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`buy_${product._id}`)
                    .setLabel('Buy')
                    .setStyle(ButtonStyle.Success)
            );
            await interaction.channel.send({ embeds: [embed], components: [row] });
        }

        await interaction.editReply({ embeds: [Embed.success('Store', `${products.length} product(s) listed above.`)] });
    },
};
