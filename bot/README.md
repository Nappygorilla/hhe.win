# Luna.win Discord Bot

Railway background worker for Luna.win.

## Commands

- `/status` — reads the Luna API health/status data.
- `/products` — reads the Luna API catalog.

## Local setup

1. Copy `.env.example` to `.env`.
2. Set `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, and optionally `DISCORD_GUILD_ID`.
3. Set `LUNA_API_URL` to your deployed API URL.
4. Run `npm install`.
5. Run `npm run register` once to register the slash commands.
6. Run `npm start`.

## Railway

Use `/bot` as the service Root Directory and keep the bot as a long-running worker.

Required variables:

- `DISCORD_TOKEN`
- `DISCORD_CLIENT_ID`
- `LUNA_API_URL`

Optional:

- `DISCORD_GUILD_ID` — useful for a single server while testing.
