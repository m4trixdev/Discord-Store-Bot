const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`[Bot] Logged in as ${client.user.tag}`);
        client.user.setActivity('the store', { type: 3 });
    },
};
