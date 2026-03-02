const { readdirSync } = require('fs');
const { join } = require('path');

class EventLoader {
    constructor(client) {
        this.client = client;
    }

    async load() {
        const eventsPath = join(__dirname, '..', 'events');
        const files = readdirSync(eventsPath).filter((f) => f.endsWith('.js'));
        let loaded = 0;

        for (const file of files) {
            const event = require(join(eventsPath, file));
            if (!event.name || !event.execute) {
                console.warn(`[EventLoader] Skipping ${file}: missing name or execute`);
                continue;
            }

            if (event.once) {
                this.client.once(event.name, (...args) => event.execute(...args));
            } else {
                this.client.on(event.name, (...args) => event.execute(...args));
            }
            loaded++;
        }

        console.log(`[EventLoader] Loaded ${loaded} events.`);
    }
}

module.exports = EventLoader;
