require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');

const commands = [];
const commandsPath = join(__dirname, 'commands');
const folders = readdirSync(commandsPath);

for (const folder of folders) {
    const files = readdirSync(join(commandsPath, folder)).filter((f) => f.endsWith('.js'));
    for (const file of files) {
        const cmd = require(join(commandsPath, folder, file));
        if (cmd.data) commands.push(cmd.data.toJSON());
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
    .then(() => console.log(`Deployed ${commands.length} commands.`))
    .catch(console.error);
