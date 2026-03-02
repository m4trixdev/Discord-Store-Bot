const User = require('../models/User');

class UserRepository {
    async findOrCreate(discordId, username) {
        let user = await User.findOne({ discordId });
        if (!user) {
            user = await User.create({ discordId, username });
        }
        return user;
    }

    async findByDiscordId(discordId) {
        return User.findOne({ discordId });
    }

    async addOrder(discordId, orderId) {
        return User.findOneAndUpdate(
            { discordId },
            { $push: { orders: orderId } },
            { new: true }
        );
    }
}

module.exports = new UserRepository();
