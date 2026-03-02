const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        discordId: { type: String, required: true, unique: true },
        username: { type: String, required: true },
        balance: { type: Number, default: 0 },
        orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    },
    { timestamps: true }
);

module.exports = model('User', userSchema);
