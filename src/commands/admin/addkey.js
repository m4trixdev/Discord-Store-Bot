const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ProductRepository = require('../../database/repositories/ProductRepository');
const Embed = require('../../utils/Embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addkey')
        .setDescription('Add a key to a product.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((o) => o.setName('product_id').setDescription('Product ID').setRequired(true))
        .addStringOption((o) => o.setName('key').setDescription('The key to add').setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const productId = interaction.options.getString('product_id');
        const key = interaction.options.getString('key');

        const product = await ProductRepository.findById(productId);
        if (!product) {
            return interaction.editReply({ embeds: [Embed.error('Product not found.')] });
        }

        await ProductRepository.addKey(productId, key);

        await interaction.editReply({
            embeds: [Embed.success('Key Added', `Key added to **${product.name}**.`)],
        });
    },
};
