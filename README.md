# Hypersight

Hypersight is a real-time public-data visualizer for Hyperliquid trade flow.
It observes public WebSocket market data only. It does not use private keys,
sign messages, connect wallets, or place orders.

## Run locally

### .env file

Copy `.env.example` to `.env`, or create a `.env` file with:

```
DATABASE_URL=postgresql://localhost/hypersight
PORT=1337
NODE_ENV=development
HYPERLIQUID_WS_URL=wss://api.hyperliquid.xyz/ws
HYPERLIQUID_COINS=BTC,ETH,SOL,HYPE
TRADE_RETENTION_HOURS=48
```

`HYPERLIQUID_WS_URL` points to Hyperliquid's public WebSocket endpoint.
`HYPERLIQUID_COINS` controls the public trade markets Hypersight watches.
`TRADE_RETENTION_HOURS` controls the local stored trade window and defaults to
48 hours.

Do not add private keys, signing credentials, wallet secrets, or order-placement
tokens. Hypersight's MVP does not use authenticated exchange actions.

### Database

You must have PostgreSQL installed and running. On Mac:

```
brew install postgresql
brew start postgresql
```

Create the local database:

```
createdb hypersight
```

### Start server

```
npm run start:dev
```

Use a browser to navigate to `http://localhost:1337/`.
