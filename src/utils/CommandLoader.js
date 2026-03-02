const { readdirSync } = require('fs');
const { join } = require('path');

class CommandLoader {
    constructor(client) {
        this.client = client;
    }

    async load() {
        const commandsPath = join(__dirname, '..', 'commands');
        const folders = readdirSync(commandsPath);
        let loaded = 0;

        for (const folder of folders) {
            const folderPath = join(commandsPath, folder);
            const files = readdirSync(folderPath).filter((f) => f.endsWith('.js'));

            for (const file of files) {
                const command = require(join(folderPath, file));
                if (!command.data || !command.execute) {
                    console.warn(`[CommandLoader] Skipping ${file}: missing data or execute`);
                    continue;
                }
                this.client.commands.set(command.data.name, command);
                loaded++;
            }
        }

        console.log(`[CommandLoader] Loaded ${loaded} commands.`);
    }
}

module.exports = CommandLoader;
