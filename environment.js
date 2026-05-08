if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://localhost/hypersight'
process.env.PORT = process.env.PORT || '1337'
process.env.HYPERLIQUID_WS_URL = process.env.HYPERLIQUID_WS_URL || 'wss://api.hyperliquid.xyz/ws'
process.env.HYPERLIQUID_COINS = process.env.HYPERLIQUID_COINS || 'BTC,ETH,SOL,HYPE'
process.env.TRADE_RETENTION_HOURS = process.env.TRADE_RETENTION_HOURS || '48'
