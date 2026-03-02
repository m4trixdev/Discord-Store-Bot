require('dotenv').config();

const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const database = require('./database/connection');
const CommandLoader = require('./utils/CommandLoader');
const EventLoader = require('./utils/EventLoader');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Channel, Partials.Message],
});

client.commands = new Collection();
client.cooldowns = new Collection();

async function start() {
    await database.connect();

    const commandLoader = new CommandLoader(client);
    await commandLoader.load();

    const eventLoader = new EventLoader(client);
    await eventLoader.load();

    await client.login(process.env.DISCORD_TOKEN);
}

start().catch((err) => {
    console.error('[Fatal] Failed to start bot:', err);
    process.exit(1);
});
