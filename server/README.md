# Luna.win API

Railway service for the Luna.win website.

## Local setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` if PostgreSQL is available.
3. Run `npm install`.
4. Run `npm start`.

Health endpoint:

`GET /api/health`

API status:

`GET /api/status`

Product catalog:

`GET /api/products`

## Railway

Use `/server` as this service's Root Directory. Railway will use `server/railway.toml`.

Required variable:

`DATABASE_URL`

Recommended variables:

`NODE_ENV=production`

`CORS_ORIGIN=https://luna.win`
