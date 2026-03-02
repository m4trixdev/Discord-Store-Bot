# discord-store-bot

Discord bot for automated product sales with ticket support, key delivery, and role assignment.

![Node.js](https://img.shields.io/badge/Node.js-20+-green)
![discord.js](https://img.shields.io/badge/discord.js-v14-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-8-green)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

## Overview

A modular Discord bot for managing a digital product store. Supports slash commands, automated key delivery, role granting on purchase, ticket system for support, and admin product management.

## Stack

- Node.js 20+
- discord.js v14
- MongoDB + Mongoose
- dotenv

## Structure

```
src/
├── commands/
│   ├── admin/          addproduct, addkey
│   ├── store/          products, buy, orders
│   └── ticket/         ticket
├── database/
│   ├── models/         Product, Order, Ticket, User
│   └── repositories/   ProductRepository, OrderRepository, UserRepository
├── events/             ready, interactionCreate
├── services/           StoreService, TicketService
├── utils/              CommandLoader, EventLoader, Embed
├── deploy-commands.js
└── index.js
```

## Setup

```bash
git clone https://github.com/m4trixdev/discord-store-bot.git
cd discord-store-bot
npm install
cp .env.example .env
# Fill in .env with your credentials
```

Deploy slash commands to your guild:

```bash
npm run deploy
```

Start the bot:

```bash
npm start
```

## Commands

### Store

| Command | Description |
|---------|-------------|
| `/products` | List all available products |
| `/buy <product_id>` | Purchase a product by ID |
| `/orders` | View your purchase history |
| `/ticket <reason>` | Open a support ticket |

### Admin

| Command | Description | Permission |
|---------|-------------|------------|
| `/addproduct` | Add a product to the store | Administrator |
| `/addkey <product_id> <key>` | Add a key to a product | Administrator |

## How it works

1. Admin adds products via `/addproduct`
2. Keys (if any) are added with `/addkey`
3. Users browse with `/products` and purchase with `/buy`
4. On purchase: key is delivered via DM, role is granted if configured
5. Support handled through `/ticket`

## Environment variables

| Variable | Description |
|----------|-------------|
| `DISCORD_TOKEN` | Bot token |
| `CLIENT_ID` | Application client ID |
| `GUILD_ID` | Guild to deploy commands to |
| `MONGODB_URI` | MongoDB connection string |
| `DB_NAME` | Database name |
| `TICKET_CATEGORY_ID` | Category channel for tickets |
| `SUPPORT_ROLE_ID` | Role with access to ticket channels |

## Author

**M4trixDev** — [github.com/m4trixdev](https://github.com/m4trixdev)

## License

MIT
