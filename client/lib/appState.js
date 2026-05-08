import create from 'zustand'

export const DEFAULT_COINS = ['BTC', 'ETH', 'SOL', 'HYPE']

export const DEFAULT_MARKET_STATS = {
  generatedAt: null,
  markets: {},
  topMarkets: [],
  latestTrades: [],
  coverage: {
    observedWindowMs: 0,
    observedWindowHours: 0,
    configuredWindowMs: 24 * 60 * 60 * 1000,
    coverageAgeMs: null,
    oldestTradeTimeMs: null,
    newestTradeTimeMs: null,
    gapAffected: false,
    gapEvents: [],
  },
}

export const DEFAULT_CONNECTION_STATUS = {
  status: 'initializing',
  connected: false,
  reconnecting: false,
  stale: false,
  gapAffected: false,
  coins: DEFAULT_COINS,
  updatedAt: null,
}

function tradeKey(trade) {
  return `${trade.coin}:${trade.timeMs}:${trade.tid}`
}

function normalizeTrade(trade) {
  if (!trade) return null
  return {
    coin: String(trade.coin || '').toUpperCase(),
    tid: Number(trade.tid),
    timeMs: Number(trade.timeMs === undefined ? trade.time_ms : trade.timeMs),
    side: trade.side || 'unknown',
    rawSide: trade.rawSide === undefined ? trade.raw_side : trade.rawSide,
    price: String(trade.price || '0'),
    size: String(trade.size || '0'),
    notional: String(trade.notional || '0'),
    hash: trade.hash || null,
  }
}

function mergeTrades(existingTrades, incomingTrades) {
  const seen = new Set()
  const merged = []

  ;[...(incomingTrades || []), ...(existingTrades || [])].forEach(rawTrade => {
    const trade = normalizeTrade(rawTrade)
    if (!trade || !trade.coin || !Number.isFinite(trade.timeMs) || !Number.isFinite(trade.tid)) return

    const key = tradeKey(trade)
    if (seen.has(key)) return

    seen.add(key)
    merged.push(trade)
  })

  return merged
    .sort((left, right) => right.timeMs - left.timeMs)
    .slice(0, 240)
}

const useAppState = create(set => ({
  selectedCoin: DEFAULT_COINS[0],
  enabledCoins: DEFAULT_COINS,
  liveTrades: [],
  marketStats: DEFAULT_MARKET_STATS,
  connectionStatus: DEFAULT_CONNECTION_STATUS,
  setSelectedCoin: selectedCoin => set(() => ({ selectedCoin })),
  setEnabledCoins: enabledCoins => set(state => {
    const coins = (enabledCoins && enabledCoins.length ? enabledCoins : DEFAULT_COINS)
      .map(coin => String(coin).toUpperCase())

    return {
      enabledCoins: coins,
      selectedCoin: coins.indexOf(state.selectedCoin) === -1 ? coins[0] : state.selectedCoin,
    }
  }),
  addTrades: trades => set(state => ({
    liveTrades: mergeTrades(state.liveTrades, trades),
  })),
  setMarketStats: marketStats => set(() => ({
    marketStats: marketStats || DEFAULT_MARKET_STATS,
  })),
  setConnectionStatus: connectionStatus => set(state => ({
    connectionStatus: {
      ...state.connectionStatus,
      ...(connectionStatus || {}),
    },
  })),
}))

export default useAppState
