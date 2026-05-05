const client = require('../database')
const commands = require('../commands')
const { toPublicTrade } = require('../commands/saveTrades')
const { createEmptyMarketStats } = require('../commands/processMarketStats')

const DEFAULT_COINS = ['BTC', 'ETH', 'SOL', 'HYPE']
const DEFAULT_TRADE_LIMIT = 100

let currentConnectionStatus = getCurrentConnectionStatus({
  status: 'initialized',
  connected: false,
  reconnecting: false,
  stale: false,
  gapAffected: false,
  coins: DEFAULT_COINS,
  lastStatusAt: null,
})

function getConfiguredCoins(env){
  const source = (env || process.env).HYPERLIQUID_COINS
  if (!source) return DEFAULT_COINS.slice()

  const coins = String(source)
    .split(',')
    .map(coin => coin.trim().toUpperCase())
    .filter(Boolean)

  return coins.length ? coins : DEFAULT_COINS.slice()
}

function normalizeCoins(coins){
  const normalized = (coins || getConfiguredCoins())
    .map(coin => String(coin || '').trim().toUpperCase())
    .filter(Boolean)

  return Array.from(new Set(normalized))
}

function normalizeLimit(limit){
  const parsed = Number(limit)
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_TRADE_LIMIT
  return Math.min(Math.floor(parsed), 500)
}

function normalizeCoin(coin){
  return String(coin || '').trim().toUpperCase()
}

async function reconcileMarkets({ client: dbClient, coins } = {}){
  if (!dbClient) throw new Error('client is required')

  const configuredCoins = normalizeCoins(coins)
  if (!configuredCoins.length) return []

  const values = []
  const rows = configuredCoins.map((coin, index) => {
    const offset = index * 2
    values.push(coin, coin)
    return `($${offset + 1}, $${offset + 2}, true)`
  })

  return await dbClient.query(
    `
      INSERT INTO markets (
        coin,
        display_name,
        enabled
      )
      VALUES
        ${rows.join(',\n        ')}
      ON CONFLICT (coin) DO UPDATE
      SET
        display_name = EXCLUDED.display_name,
        updated_at = now()
      RETURNING
        coin,
        display_name,
        enabled
    `,
    values
  )
}

function toPublicMarket(row){
  return {
    coin: row.coin,
    displayName: row.display_name === undefined ? row.displayName : row.display_name,
    enabled: row.enabled !== false,
  }
}

async function getMarketsFromClient({ client: dbClient, coins } = {}){
  if (!dbClient) throw new Error('client is required')

  const configuredCoins = normalizeCoins(coins)
  const rows = await dbClient.query(
    `
      SELECT
        coin,
        display_name,
        enabled
      FROM markets
      WHERE enabled = true
      ORDER BY coin ASC
    `
  )

  if (!rows.length) {
    return configuredCoins.map(coin => ({
      coin,
      displayName: coin,
      enabled: true,
    }))
  }

  const order = configuredCoins.reduce((memo, coin, index) => {
    memo[coin] = index
    return memo
  }, {})

  return rows
    .filter(row => configuredCoins.indexOf(row.coin) !== -1)
    .map(toPublicMarket)
    .filter(market => market.enabled)
    .sort((left, right) => {
      const leftOrder = order[left.coin] === undefined ? Number.MAX_SAFE_INTEGER : order[left.coin]
      const rightOrder = order[right.coin] === undefined ? Number.MAX_SAFE_INTEGER : order[right.coin]
      if (leftOrder !== rightOrder) return leftOrder - rightOrder
      return left.coin.localeCompare(right.coin)
    })
}

async function getLatestTradesFromClient({ client: dbClient, coin, limit } = {}){
  if (!dbClient) throw new Error('client is required')

  const tradeLimit = normalizeLimit(limit)
  const normalizedCoin = normalizeCoin(coin)
  const values = normalizedCoin ? [normalizedCoin, tradeLimit] : [tradeLimit]
  const whereClause = normalizedCoin ? 'WHERE coin = $1' : ''
  const limitPlaceholder = normalizedCoin ? '$2' : '$1'

  const rows = await dbClient.query(
    `
      SELECT
        coin,
        tid,
        time_ms,
        side,
        raw_side,
        price,
        size,
        notional,
        hash
      FROM trades
      ${whereClause}
      ORDER BY time_ms DESC
      LIMIT ${limitPlaceholder}
    `,
    values
  )

  return rows.map(toPublicTrade)
}

async function getMarketStatsFromClient({ client: dbClient, coins } = {}){
  if (!dbClient) throw new Error('client is required')

  const rows = await dbClient.query(
    `
      SELECT
        payload,
        updated_at
      FROM market_stats_cache
      WHERE cache_name = $1
      LIMIT 1
    `,
    ['marketStats']
  )

  if (!rows.length) {
    return createEmptyMarketStats({
      configuredCoins: normalizeCoins(coins),
      nowMs: Date.now(),
    })
  }

  const payload = typeof rows[0].payload === 'string'
    ? JSON.parse(rows[0].payload)
    : rows[0].payload

  return payload
}

function getCurrentConnectionStatus(status){
  const source = status || currentConnectionStatus || {}

  return {
    status: source.status || 'initialized',
    connected: source.connected === true,
    reconnecting: source.reconnecting === true,
    stale: source.stale === true,
    gapAffected: source.gapAffected === true,
    coins: normalizeCoins(source.coins || getConfiguredCoins()),
    updatedAt: source.updatedAt || source.lastStatusAt || null,
  }
}

function setCurrentConnectionStatus(status){
  currentConnectionStatus = getCurrentConnectionStatus(status)
  return currentConnectionStatus
}

async function getMarkets(){
  const coins = getConfiguredCoins()
  await reconcileMarkets({ client, coins })
  return await getMarketsFromClient({ client, coins })
}

async function getLatestTrades({ coin, limit } = {}){
  return await getLatestTradesFromClient({ client, coin, limit })
}

async function getMarketStats(){
  return await getMarketStatsFromClient({
    client,
    coins: getConfiguredCoins(),
  })
}

async function getHealth(){
  return {
    service: 'hypersight',
    ingestion: getCurrentConnectionStatus(),
    markets: await getMarkets(),
  }
}

async function saveTrades({ trades }){
  return await commands.saveTrades({ client, trades })
}

async function processMarketStats(){
  return await commands.processMarketStats({
    client,
    configuredCoins: getConfiguredCoins(),
  })
}

module.exports = {
  getConfiguredCoins,
  getCurrentConnectionStatus,
  getHealth,
  getLatestTrades,
  getLatestTradesFromClient,
  getMarketStats,
  getMarketStatsFromClient,
  getMarkets,
  getMarketsFromClient,
  processMarketStats,
  reconcileMarkets,
  saveTrades,
  setCurrentConnectionStatus,
}
