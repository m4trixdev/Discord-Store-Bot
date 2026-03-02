const {
    ChannelType,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');
const Ticket = require('../database/models/Ticket');

class TicketService {
    async open(guild, user, reason, orderId = null) {
        const existing = await Ticket.findOne({ userId: user.id, status: 'OPEN' });
        if (existing) {
            return { success: false, error: 'You already have an open ticket.' };
        }

        const category = process.env.TICKET_CATEGORY_ID;

        const channel = await guild.channels.create({
            name: `ticket-${user.username}`,
            type: ChannelType.GuildText,
            parent: category || null,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: user.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                },
                {
                    id: process.env.SUPPORT_ROLE_ID,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                },
            ],
        });

        const ticket = await Ticket.create({
            userId: user.id,
            channelId: channel.id,
            orderId,
            reason,
        });

        const embed = new EmbedBuilder()
            .setTitle('Support Ticket')
            .setDescription(`Opened by <@${user.id}>\n**Reason:** ${reason}`)
            .setColor(0x5865f2)
            .setTimestamp();

        const closeButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`ticket_close_${ticket._id}`)
                .setLabel('Close Ticket')
                .setStyle(ButtonStyle.Danger)
        );

        await channel.send({ embeds: [embed], components: [closeButton] });

        return { success: true, channel, ticket };
    }

    async close(ticketId, closedBy, guild) {
        const ticket = await Ticket.findByIdAndUpdate(
            ticketId,
            { status: 'CLOSED', closedBy },
            { new: true }
        );
        if (!ticket) return { success: false, error: 'Ticket not found.' };

        const channel = guild.channels.cache.get(ticket.channelId);
        if (channel) {
            await channel.send('This ticket has been closed and will be deleted shortly.');
            setTimeout(() => channel.delete().catch(() => {}), 5000);
        }

        return { success: true };
    }
}

module.exports = new TicketService();
