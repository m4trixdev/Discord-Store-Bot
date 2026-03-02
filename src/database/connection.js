const mongoose = require('mongoose');

class Database {
    constructor() {
        this.connected = false;
    }

    async connect() {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI is not defined in environment variables.');
        }

        try {
            await mongoose.connect(uri, {
                dbName: process.env.DB_NAME || 'discord_store',
            });
            this.connected = true;
            console.log('[Database] Connected to MongoDB.');
        } catch (err) {
            console.error('[Database] Connection failed:', err.message);
            throw err;
        }
    }

    async disconnect() {
        if (this.connected) {
            await mongoose.disconnect();
            this.connected = false;
        }
    }
}

module.exports = new Database();
