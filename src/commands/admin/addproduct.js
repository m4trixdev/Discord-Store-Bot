const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ProductRepository = require('../../database/repositories/ProductRepository');
const Embed = require('../../utils/Embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addproduct')
        .setDescription('Add a product to the store.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((o) => o.setName('name').setDescription('Product name').setRequired(true))
        .addStringOption((o) => o.setName('description').setDescription('Product description').setRequired(true))
        .addNumberOption((o) => o.setName('price').setDescription('Price in USD').setRequired(true))
        .addIntegerOption((o) => o.setName('stock').setDescription('Stock (-1 = unlimited)').setRequired(false))
        .addStringOption((o) => o.setName('role_id').setDescription('Role ID to grant on purchase').setRequired(false)),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const product = await ProductRepository.create({
            name: interaction.options.getString('name'),
            description: interaction.options.getString('description'),
            price: interaction.options.getNumber('price'),
            stock: interaction.options.getInteger('stock') ?? -1,
            roleId: interaction.options.getString('role_id') || null,
        });

        await interaction.editReply({
            embeds: [Embed.success('Product Added', `**${product.name}** added with ID \`${product._id}\`.`)],
        });
    },
};
