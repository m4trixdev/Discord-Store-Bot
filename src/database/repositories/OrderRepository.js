const Order = require('../models/Order');

class OrderRepository {
    async create(data) {
        return Order.create(data);
    }

    async findById(id) {
        return Order.findById(id).populate('productId');
    }

    async findByUser(userId) {
        return Order.find({ userId }).sort({ createdAt: -1 });
    }

    async findAll() {
        return Order.find().sort({ createdAt: -1 });
    }

    async update(id, data) {
        return Order.findByIdAndUpdate(id, data, { new: true });
    }
}

module.exports = new OrderRepository();
