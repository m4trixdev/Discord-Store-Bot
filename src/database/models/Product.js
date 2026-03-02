const { Schema, model } = require('mongoose');

const productSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        stock: { type: Number, default: -1 },
        roleId: { type: String, default: null },
        active: { type: Boolean, default: true },
        keys: [{ type: String }],
    },
    { timestamps: true }
);

module.exports = model('Product', productSchema);
