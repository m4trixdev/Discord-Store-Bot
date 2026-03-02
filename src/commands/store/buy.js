const { SlashCommandBuilder } = require('discord.js');
const StoreService = require('../../services/StoreService');
const Embed = require('../../utils/Embed');

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Purchase a product by ID.')
        .addStringOption((opt) =>
            opt.setName('product_id').setDescription('Product ID to purchase.').setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const productId = interaction.options.getString('product_id');
        const result = await StoreService.purchaseProduct(
            interaction.user.id,
            interaction.user.username,
            productId
        );

        if (!result.success) {
            return interaction.editReply({ embeds: [Embed.error(result.error)] });
        }

        const { order, product, key } = result;

        const embed = Embed.success(
            'Purchase Confirmed',
            `You purchased **${product.name}** for **$${product.price.toFixed(2)}**.`
        );

        if (key) {
            embed.addFields({ name: 'Your Key', value: `\`${key}\`` });
        }

        if (product.roleId && interaction.guild) {
            try {
                const member = await interaction.guild.members.fetch(interaction.user.id);
                await member.roles.add(product.roleId);
                embed.addFields({ name: 'Role', value: 'Access role granted.' });
            } catch {
                embed.addFields({ name: 'Role', value: 'Could not assign role — contact support.' });
            }
        }

        await interaction.editReply({ embeds: [embed] });
    },
};
