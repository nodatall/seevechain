# Hypersight

Hypersight is a real-time public-data visualizer for Hyperliquid trade flow. It listens to public trade streams, stores recent trades in Postgres, and pushes live market activity to the browser with Socket.IO.

This MVP is not a trading bot. It uses no private keys, no signing, no order placement, no wallet connection, and no authenticated exchange actions. `HYPERTRACKER_API_TOKEN` may exist in a local `.env`, but Hypersight does not read or expose it.

## Requirements

- Node 20
- PostgreSQL
- npm

## Setup

```bash
npm install
createdb hypersight
cp .env.example .env
npm run db:migrate
npm run start:dev
```

Open `http://localhost:1337/`.

## Environment

```bash
DATABASE_URL=postgresql://localhost/hypersight
PORT=1337
NODE_ENV=development
HYPERLIQUID_WS_URL=wss://api.hyperliquid.xyz/ws
HYPERLIQUID_COINS=BTC,ETH,SOL,HYPE
TRADE_RETENTION_HOURS=48
```

`HYPERLIQUID_WS_URL` is the Hyperliquid public WebSocket endpoint.

`HYPERLIQUID_COINS` is the comma-separated public trade market list. The default is `BTC,ETH,SOL,HYPE`.

`TRADE_RETENTION_HOURS` controls local pruning of stored trades. The default is `48`.

`PORT` defaults to `1337`.

## Data Model

Hypersight stores public trades in Postgres with a duplicate-safe key of `coin + time_ms + tid`. It computes observed window market stats from stored trades: volume, trade count, buy notional, sell notional, imbalance, latest price, top markets, latest trades, and coverage metadata.

The stats are intentionally labeled as an observed window. They describe what this app has stored, not a guaranteed complete external 24h market history. Feed status events record connect, disconnect, stale, reconnect, and gap state so the UI can avoid implying continuous coverage after downtime.

## API

- `GET /api/health`
- `GET /api/markets`
- `GET /api/trades?coin=BTC&limit=100`
- `GET /api/market_stats`

Socket.IO events:

- client request: `clientAskForLatest`
- server trades: `serverSendTrades`
- server stats: `serverSendMarketStats`
- server connection state: `serverSendConnectionStatus`

Public REST and Socket.IO payloads omit buyer, seller, `users`, raw payloads, wallet-private fills, and account-private data.

## Troubleshooting

No trades: check `HYPERLIQUID_COINS`, network access to `wss://api.hyperliquid.xyz/ws`, and `/api/health`.

Database errors: confirm Postgres is running, `createdb hypersight` has been run, and `DATABASE_URL` points to the same database.

Missing tables: run `npm run db:migrate`.

WebSocket reconnects: occasional reconnects are expected. The app records feed status and resubscribes to configured public trade feeds.

Build errors: confirm Node 20 is active. The package keeps a Webpack 4 build, so the npm scripts set the required OpenSSL compatibility flag.

Safety check: this project has no private keys, no signing, no order placement, and no wallet controls in the MVP.
