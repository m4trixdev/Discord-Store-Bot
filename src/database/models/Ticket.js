const { Schema, model } = require('mongoose');

const ticketSchema = new Schema(
    {
        userId: { type: String, required: true },
        channelId: { type: String, required: true, unique: true },
        orderId: { type: Schema.Types.ObjectId, ref: 'Order', default: null },
        reason: { type: String, required: true },
        status: {
            type: String,
            enum: ['OPEN', 'CLOSED'],
            default: 'OPEN',
        },
        closedBy: { type: String, default: null },
    },
    { timestamps: true }
);

module.exports = model('Ticket', ticketSchema);
