const ProductRepository = require('../database/repositories/ProductRepository');
const OrderRepository = require('../database/repositories/OrderRepository');
const UserRepository = require('../database/repositories/UserRepository');

class StoreService {
    async getProducts() {
        return ProductRepository.findAll(true);
    }

    async purchaseProduct(discordId, username, productId) {
        const product = await ProductRepository.findById(productId);
        if (!product || !product.active) {
            return { success: false, error: 'Product not found or unavailable.' };
        }

        if (product.stock === 0) {
            return { success: false, error: 'This product is out of stock.' };
        }

        const user = await UserRepository.findOrCreate(discordId, username);

        let key = null;
        if (product.keys.length > 0) {
            key = await ProductRepository.consumeKey(productId);
        }

        if (product.stock > 0) {
            await ProductRepository.update(productId, { $inc: { stock: -1 } });
        }

        const order = await OrderRepository.create({
            userId: discordId,
            productId: product._id,
            productName: product.name,
            price: product.price,
            key,
            status: 'COMPLETED',
        });

        await UserRepository.addOrder(discordId, order._id);

        return { success: true, order, product, key };
    }

    async getUserOrders(discordId) {
        return OrderRepository.findByUser(discordId);
    }
}

module.exports = new StoreService();
