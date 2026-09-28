# Luna.win — Railway deployment

Luna.win is prepared as an isolated monorepo with three deployable services:
- Frontend — repository root `/`
- API — `/server`
- Discord bot — `/bot`

## 1. Create the Railway project
Create one Railway project and connect `Nappygorilla/Luna.win`.
Keep each service connected to the `main` branch.

## 2. PostgreSQL
Create a PostgreSQL service in the same Railway project.
The API expects `DATABASE_URL`.
The API `preDeployCommand` runs `npm run db:migrate`, which creates the base tables from `server/schema.sql`.

## 3. API service
Create a service from the GitHub repository.
- Root Directory: `/server`
- Config file: `/server/railway.toml`

Variables:
- `DATABASE_URL` — reference the Railway Postgres connection string
- `NODE_ENV=production`
- `CORS_ORIGIN=https://luna.win`

Healthcheck: `GET /api/health`
Endpoints:
- `GET /api/health`
- `GET /api/status`
- `GET /api/products`

After deployment, give the API service a public domain. Use that domain for the bot `LUNA_API_URL` value.

## 4. Discord bot service
Create another service from the same GitHub repository.
- Root Directory: `/bot`
- Config file: `/bot/railway.toml`

Variables:
- `DISCORD_TOKEN`
- `DISCORD_CLIENT_ID`
- `LUNA_API_URL=https://your-api-domain`

For testing one Discord server, also set `DISCORD_GUILD_ID`.
Register slash commands once with `npm run register`.
The deployed worker runs with `npm start`.

Current commands:
- `/status`
- `/products`

## 5. Frontend
Your existing static website remains at the repository root `/`.
Deploy it as the frontend/static service.
The frontend is not yet hard-wired to a specific API domain because that value is environment-specific. It can be connected after the API service has a domain.

## Security
Never commit `DISCORD_TOKEN`, database passwords, session secrets, API keys, or real credentials.
Use Railway Variables for secrets. The repository only contains example environment files.

## Current scope
The API currently provides infrastructure endpoints plus status and catalog data.
Authentication, sessions, payments, and production licensing are not being represented as finished systems until they are connected to real server-side storage and security controls.