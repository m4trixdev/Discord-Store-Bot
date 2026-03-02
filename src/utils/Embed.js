const { EmbedBuilder } = require('discord.js');

class Embed {
    static success(title, description) {
        return new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(0x57f287)
            .setTimestamp();
    }

    static error(description) {
        return new EmbedBuilder()
            .setTitle('Error')
            .setDescription(description)
            .setColor(0xed4245)
            .setTimestamp();
    }

    static info(title, description) {
        return new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(0x5865f2)
            .setTimestamp();
    }

    static product(product) {
        return new EmbedBuilder()
            .setTitle(product.name)
            .setDescription(product.description)
            .addFields(
                { name: 'Price', value: `$${product.price.toFixed(2)}`, inline: true },
                {
                    name: 'Stock',
                    value: product.stock === -1 ? 'Unlimited' : String(product.stock),
                    inline: true,
                }
            )
            .setColor(0xfee75c)
            .setTimestamp();
    }
}

module.exports = Embed;
