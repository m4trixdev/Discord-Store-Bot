const { Schema, model } = require('mongoose');

const orderSchema = new Schema(
    {
        userId: { type: String, required: true },
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        productName: { type: String, required: true },
        price: { type: Number, required: true },
        key: { type: String, default: null },
        status: {
            type: String,
            enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
            default: 'PENDING',
        },
    },
    { timestamps: true }
);

module.exports = model('Order', orderSchema);
