const BigNumber = require('bignumber.js')

const { toPublicTrade } = require('./saveTrades')

const DEFAULT_COINS = ['BTC', 'ETH', 'SOL', 'HYPE']
const DEFAULT_WINDOW_HOURS = 24
const DEFAULT_LATEST_TRADE_LIMIT = 100

function getConfiguredCoins(configuredCoins){
  const source = configuredCoins || (process.env.HYPERLIQUID_COINS && process.env.HYPERLIQUID_COINS.split(',')) || DEFAULT_COINS
  return source.map(coin => String(coin).trim().toUpperCase()).filter(Boolean)
}

function getConfiguredCoinSet(configuredCoins){
  return new Set(getConfiguredCoins(configuredCoins))
}

function decimalString(value){
  return new BigNumber(value || 0).toFixed()
}

function createMarket(coin){
  return {
    coin,
    tradeCount: 0,
    volume: '0',
    notional: '0',
    volumeNotional: '0',
    buyNotional: '0',
    sellNotional: '0',
    imbalance: '0',
    latestPrice: null,
    latestTradeTimeMs: null,
  }
}

function isGapEvent(event){
  return ['gap', 'disconnected', 'stale', 'reconnecting'].indexOf(event.event_type || event.eventType || event.type) !== -1
}

function toMs(value){
  if (value === undefined || value === null) return null
  if (typeof value === 'number') return value
  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? null : parsed
}

function eventOverlapsWindow(event, windowStartMs, nowMs){
  const startedAtMs = toMs(event.started_at || event.startedAt)
  const endedAtMs = toMs(event.ended_at || event.endedAt) || nowMs

  if (startedAtMs === null) return false
  return startedAtMs <= nowMs && endedAtMs >= windowStartMs
}

function createEmptyMarketStats({ configuredCoins, nowMs }){
  const coins = getConfiguredCoins(configuredCoins)
  const markets = coins.reduce((memo, coin) => {
    memo[coin] = createMarket(coin)
    return memo
  }, {})

  return {
    generatedAt: new Date(nowMs || Date.now()).toISOString(),
    markets,
    topMarkets: [],
    latestTrades: [],
    coverage: {
      observedWindowMs: 0,
      observedWindowHours: 0,
      configuredWindowMs: DEFAULT_WINDOW_HOURS * 60 * 60 * 1000,
      windowStartMs: null,
      windowEndMs: nowMs || Date.now(),
      coverageAgeMs: null,
      oldestTradeTimeMs: null,
      newestTradeTimeMs: null,
      gapAffected: false,
      gapEvents: [],
    },
  }
}

function buildMarketStats({ trades, feedStatusEvents, nowMs, configuredCoins, latestTradeLimit }){
  const rows = (trades || []).slice().sort((left, right) => Number(left.time_ms) - Number(right.time_ms))
  const stats = createEmptyMarketStats({ configuredCoins, nowMs })
  const configuredCoinSet = getConfiguredCoinSet(configuredCoins)
  const generatedAtMs = nowMs || Date.now()
  const windowStartMs = generatedAtMs - (DEFAULT_WINDOW_HOURS * 60 * 60 * 1000)
  const latestLimit = latestTradeLimit || DEFAULT_LATEST_TRADE_LIMIT
  let oldestTradeTimeMs = null
  let newestTradeTimeMs = null

  rows.forEach(trade => {
    const coin = String(trade.coin || '').trim().toUpperCase()
    if (!coin) return
    if (!configuredCoinSet.has(coin)) return

    const market = stats.markets[coin]
    const tradeTimeMs = Number(trade.time_ms === undefined ? trade.timeMs : trade.time_ms)
    const notional = new BigNumber(trade.notional || 0)

    market.tradeCount += 1
    market.notional = decimalString(new BigNumber(market.notional).plus(notional))
    market.volume = market.notional
    market.volumeNotional = market.notional

    if (trade.side === 'buy') {
      market.buyNotional = decimalString(new BigNumber(market.buyNotional).plus(notional))
    } else if (trade.side === 'sell') {
      market.sellNotional = decimalString(new BigNumber(market.sellNotional).plus(notional))
    }

    market.imbalance = decimalString(new BigNumber(market.buyNotional).minus(market.sellNotional))

    if (market.latestTradeTimeMs === null || tradeTimeMs >= market.latestTradeTimeMs) {
      market.latestTradeTimeMs = tradeTimeMs
      market.latestPrice = String(trade.price)
    }

    if (oldestTradeTimeMs === null || tradeTimeMs < oldestTradeTimeMs) oldestTradeTimeMs = tradeTimeMs
    if (newestTradeTimeMs === null || tradeTimeMs > newestTradeTimeMs) newestTradeTimeMs = tradeTimeMs
  })

  const gapEvents = (feedStatusEvents || []).filter(event => (
    isGapEvent(event) && eventOverlapsWindow(event, windowStartMs, generatedAtMs)
  ))

  const observedWindowMs = oldestTradeTimeMs === null || newestTradeTimeMs === null
    ? 0
    : Math.max(0, newestTradeTimeMs - oldestTradeTimeMs)

  stats.latestTrades = rows
    .slice()
    .filter(trade => configuredCoinSet.has(String(trade.coin || '').trim().toUpperCase()))
    .sort((left, right) => Number(right.time_ms) - Number(left.time_ms))
    .slice(0, latestLimit)
    .map(toPublicTrade)

  stats.topMarkets = Object.keys(stats.markets)
    .map(coin => stats.markets[coin])
    .filter(market => market.tradeCount > 0)
    .sort((left, right) => new BigNumber(right.notional).comparedTo(left.notional))
    .map(market => ({
      coin: market.coin,
      tradeCount: market.tradeCount,
      notional: market.notional,
      volume: market.volume,
      volumeNotional: market.volumeNotional,
      latestPrice: market.latestPrice,
    }))

  stats.coverage = {
    observedWindowMs,
    observedWindowHours: Number(new BigNumber(observedWindowMs).dividedBy(60 * 60 * 1000).toFixed(6)),
    configuredWindowMs: DEFAULT_WINDOW_HOURS * 60 * 60 * 1000,
    windowStartMs,
    windowEndMs: generatedAtMs,
    coverageAgeMs: newestTradeTimeMs === null ? null : Math.max(0, generatedAtMs - newestTradeTimeMs),
    oldestTradeTimeMs,
    newestTradeTimeMs,
    gapAffected: gapEvents.length > 0,
    gapEvents,
  }

  return stats
}

async function processMarketStats({
  client,
  configuredCoins,
  nowMs,
  windowHours,
  latestTradeLimit,
}){
  if (!client) throw new Error('client is required')

  const generatedAtMs = nowMs || Date.now()
  const observedWindowHours = windowHours || DEFAULT_WINDOW_HOURS
  const windowStartMs = generatedAtMs - (observedWindowHours * 60 * 60 * 1000)
  const limit = latestTradeLimit || DEFAULT_LATEST_TRADE_LIMIT
  const coins = getConfiguredCoins(configuredCoins)

  const trades = await client.query(
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
      WHERE time_ms >= $1
        AND coin = ANY($2)
      ORDER BY time_ms DESC
    `,
    [windowStartMs, coins]
  )

  const feedStatusEvents = await client.query(
    `
      SELECT
        event_type,
        started_at,
        ended_at,
        details
      FROM feed_status_events
      WHERE started_at >= $1
        OR ended_at >= $1
        OR ended_at IS NULL
      ORDER BY started_at DESC
    `,
    [new Date(windowStartMs).toISOString()]
  )

  const stats = buildMarketStats({
    trades,
    feedStatusEvents,
    nowMs: generatedAtMs,
    configuredCoins: coins,
    latestTradeLimit: limit,
  })

  await client.query(
    `
      INSERT INTO market_stats_cache (
        cache_name,
        payload,
        updated_at
      )
      VALUES ($1, $2, now())
      ON CONFLICT (cache_name) DO UPDATE
      SET
        payload = EXCLUDED.payload,
        updated_at = EXCLUDED.updated_at
    `,
    [
      'marketStats',
      JSON.stringify(stats),
    ]
  )

  return stats
}

module.exports = processMarketStats
module.exports.buildMarketStats = buildMarketStats
module.exports.createEmptyMarketStats = createEmptyMarketStats
