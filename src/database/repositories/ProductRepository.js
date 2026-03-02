const Product = require('../models/Product');

class ProductRepository {
    async findAll(onlyActive = true) {
        const filter = onlyActive ? { active: true } : {};
        return Product.find(filter).sort({ createdAt: -1 });
    }

    async findById(id) {
        return Product.findById(id);
    }

    async create(data) {
        return Product.create(data);
    }

    async update(id, data) {
        return Product.findByIdAndUpdate(id, data, { new: true });
    }

    async addKey(id, key) {
        return Product.findByIdAndUpdate(id, { $push: { keys: key } }, { new: true });
    }

    async consumeKey(id) {
        const product = await Product.findById(id);
        if (!product || product.keys.length === 0) return null;
        const key = product.keys[0];
        await Product.findByIdAndUpdate(id, { $pop: { keys: -1 } });
        return key;
    }

    async delete(id) {
        return Product.findByIdAndDelete(id);
    }
}

module.exports = new ProductRepository();
