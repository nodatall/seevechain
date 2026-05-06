import React from 'react'
import { useEffect, useMemo, useState } from 'preact/hooks'
import ioClient from 'socket.io-client'

import useAppState, {
  DEFAULT_COINS,
  DEFAULT_CONNECTION_STATUS,
  DEFAULT_MARKET_STATS,
} from 'lib/appState'
import BottomBar from 'components/BottomBar'
import Stars from 'components/Stars'
import Transactions from 'components/Transactions'

import './index.sass'

const MAX_TAPE_TRADES = 80
const MAX_VISUAL_TRADES = 140

export default function Visualizer() {
  const selectedCoin = useAppState(state => state.selectedCoin)
  const enabledCoins = useAppState(state => state.enabledCoins)
  const liveTrades = useAppState(state => state.liveTrades)
  const marketStats = useAppState(state => state.marketStats)
  const connectionStatus = useAppState(state => state.connectionStatus)
  const setSelectedCoin = useAppState(state => state.setSelectedCoin)
  const setEnabledCoins = useAppState(state => state.setEnabledCoins)
  const addTrades = useAppState(state => state.addTrades)
  const setMarketStats = useAppState(state => state.setMarketStats)
  const setConnectionStatus = useAppState(state => state.setConnectionStatus)
  const [bootstrapped, setBootstrapped] = useState(false)

  useEffect(() => {
    let active = true
    const socket = ioClient(process.env.ORIGIN || window.origin)

    function requestLatest() {
      socket.emit('clientAskForLatest')
    }

    async function loadMarkets() {
      try {
        const response = await window.fetch('/api/markets')
        const data = await response.json()
        if (!active) return

        const coins = (data.markets || [])
          .filter(market => market.enabled !== false)
          .map(market => market.coin)

        setEnabledCoins(coins.length ? coins : DEFAULT_COINS)
      } catch(error) {
        setEnabledCoins(DEFAULT_COINS)
      }
    }

    socket.on('connect', () => {
      setConnectionStatus({
        status: 'socket-connected',
        connected: true,
        reconnecting: false,
      })
      requestLatest()
    })

    socket.on('disconnect', () => {
      setConnectionStatus({
        status: 'socket-disconnected',
        connected: false,
      })
    })

    socket.on('connect_error', () => {
      setConnectionStatus({
        status: 'socket-error',
        connected: false,
        reconnecting: true,
      })
    })

    socket.on('serverSendTrades', payload => {
      addTrades(extractTrades(payload))
      setBootstrapped(true)
    })

    socket.on('serverSendMarketStats', payload => {
      setMarketStats(extractMarketStats(payload))
      setBootstrapped(true)
    })

    socket.on('serverSendConnectionStatus', payload => {
      setConnectionStatus(payload || DEFAULT_CONNECTION_STATUS)
    })

    loadMarkets()
    requestLatest()

    return () => {
      active = false
      socket.close()
    }
  }, [])

  const coins = enabledCoins.length ? enabledCoins : DEFAULT_COINS
  const normalizedStats = marketStats || DEFAULT_MARKET_STATS
  const markets = normalizedStats.markets || {}
  const selectedMarket = markets[selectedCoin] || createEmptyMarket(selectedCoin)
  const latestTrades = useMemo(() => {
    const statsTrades = normalizedStats.latestTrades || []
    return mergeTradeLists(liveTrades, statsTrades)
      .filter(trade => !selectedCoin || trade.coin === selectedCoin)
      .slice(0, MAX_TAPE_TRADES)
  }, [liveTrades, normalizedStats, selectedCoin])
  const topMarkets = useMemo(() => buildTopMarkets(coins, normalizedStats), [coins, normalizedStats])
  const visualTrades = useMemo(() => {
    return mergeTradeLists(liveTrades, normalizedStats.latestTrades || [])
      .slice(0, MAX_VISUAL_TRADES)
  }, [liveTrades, normalizedStats])

  return <main className="Visualizer">
    <Stars />
    <Transactions trades={visualTrades} />

    <header className="Visualizer-header">
      <div>
        <h1>Hypersight</h1>
        <StatusBadge status={connectionStatus} bootstrapped={bootstrapped} />
      </div>
      <CoinSelector
        coins={coins}
        selectedCoin={selectedCoin}
        onSelect={setSelectedCoin}
      />
    </header>

    <section className="Visualizer-grid" aria-label="Market details">
      <MarketStatsPanel
        coin={selectedCoin}
        market={selectedMarket}
        coverage={normalizedStats.coverage || DEFAULT_MARKET_STATS.coverage}
      />
      <TopMarkets
        markets={topMarkets}
        selectedCoin={selectedCoin}
        onSelect={setSelectedCoin}
      />
      <TradeTape trades={latestTrades} />
    </section>

    <BottomBar
      marketStats={normalizedStats}
      selectedMarket={selectedMarket}
    />
  </main>
}

function extractTrades(payload) {
  if (Array.isArray(payload)) return payload
  if (payload && Array.isArray(payload.trades)) return payload.trades
  return []
}

function extractMarketStats(payload) {
  if (payload && payload.marketStats) return payload.marketStats
  return payload || DEFAULT_MARKET_STATS
}

function normalizeTrade(trade) {
  if (!trade) return null
  const timeMs = Number(trade.timeMs === undefined ? trade.time_ms : trade.timeMs)
  const tid = Number(trade.tid)

  if (!trade.coin || !Number.isFinite(timeMs) || !Number.isFinite(tid)) return null

  return {
    coin: String(trade.coin).toUpperCase(),
    tid,
    timeMs,
    side: trade.side || 'unknown',
    rawSide: trade.rawSide || trade.raw_side || null,
    price: String(trade.price || '0'),
    size: String(trade.size || '0'),
    notional: String(trade.notional || '0'),
    hash: trade.hash || null,
  }
}

function tradeKey(trade) {
  return `${trade.coin}:${trade.timeMs}:${trade.tid}`
}

function mergeTradeLists(primaryTrades, secondaryTrades) {
  const seen = new Set()
  const merged = []

  ;[...(primaryTrades || []), ...(secondaryTrades || [])].forEach(rawTrade => {
    const trade = normalizeTrade(rawTrade)
    if (!trade) return
    const key = tradeKey(trade)
    if (seen.has(key)) return
    seen.add(key)
    merged.push(trade)
  })

  return merged.sort((left, right) => right.timeMs - left.timeMs)
}

function createEmptyMarket(coin) {
  return {
    coin,
    tradeCount: 0,
    notional: '0',
    volume: '0',
    volumeNotional: '0',
    buyNotional: '0',
    sellNotional: '0',
    imbalance: '0',
    latestPrice: null,
    latestTradeTimeMs: null,
  }
}

function buildTopMarkets(coins, marketStats) {
  const markets = marketStats.markets || {}
  const configuredMarkets = coins.map(coin => markets[coin] || createEmptyMarket(coin))
  const rankedMarkets = marketStats.topMarkets && marketStats.topMarkets.length
    ? marketStats.topMarkets
    : configuredMarkets

  return rankedMarkets
    .slice()
    .sort((left, right) => Number(right.notional || right.volumeNotional || 0) - Number(left.notional || left.volumeNotional || 0))
}

function StatusBadge({ status, bootstrapped }) {
  const connected = status && status.connected
  const stale = status && status.stale
  const reconnecting = status && status.reconnecting
  const gapAffected = status && status.gapAffected
  const label = stale
    ? 'Stale'
    : reconnecting
      ? 'Reconnecting'
      : connected
        ? 'Live'
        : bootstrapped
          ? 'Offline'
          : 'Loading'

  return <div className={`StatusBadge ${connected && !stale ? 'StatusBadge--live' : ''}`}>
    <span />
    <strong>{label}</strong>
    {gapAffected && <em>gap noted</em>}
  </div>
}

function CoinSelector({ coins, selectedCoin, onSelect }) {
  return <nav className="CoinSelector" aria-label="Coin selector">
    {coins.map(coin => <button
      key={coin}
      className={coin === selectedCoin ? 'CoinSelector-button CoinSelector-button--active' : 'CoinSelector-button'}
      type="button"
      onClick={() => onSelect(coin)}
    >
      {coin}
    </button>)}
  </nav>
}

function MarketStatsPanel({ coin, market, coverage }) {
  const imbalance = Number(market.imbalance || 0)

  return <section className="MarketStatsPanel" aria-label={`${coin} market stats`}>
    <div className="PanelHeader">
      <h2>{coin}</h2>
      <span>{coverage.gapAffected ? 'gap affected' : 'observed window'}</span>
    </div>
    <div className="MetricGrid">
      <Metric label="Latest" value={market.latestPrice ? formatPrice(market.latestPrice) : 'waiting'} />
      <Metric label="Volume" value={formatCurrency(market.notional || market.volumeNotional)} />
      <Metric label="Trades" value={formatInteger(market.tradeCount)} />
      <Metric
        label="Imbalance"
        value={formatSignedCurrency(imbalance)}
        tone={imbalance < 0 ? 'sell' : 'buy'}
      />
    </div>
    <div className="CoverageBar">
      <span style={{ width: `${getCoveragePercent(coverage)}%` }} />
    </div>
    <div className="CoverageMeta">
      <span>{formatWindowHours(coverage.observedWindowHours)}</span>
      <span>{coverage.coverageAgeMs === null ? 'no trades yet' : `${formatDuration(coverage.coverageAgeMs)} old`}</span>
    </div>
  </section>
}

function Metric({ label, value, tone }) {
  return <div className={`Metric ${tone ? `Metric--${tone}` : ''}`}>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
}

function TopMarkets({ markets, selectedCoin, onSelect }) {
  return <section className="TopMarkets" aria-label="Top markets by observed notional">
    <div className="PanelHeader">
      <h2>Top Markets</h2>
      <span>notional</span>
    </div>
    <div className="TopMarkets-list">
      {markets.map(market => <button
        type="button"
        key={market.coin}
        className={market.coin === selectedCoin ? 'TopMarket TopMarket--active' : 'TopMarket'}
        onClick={() => onSelect(market.coin)}
      >
        <span>{market.coin}</span>
        <strong>{formatCurrency(market.notional || market.volumeNotional)}</strong>
        <em>{formatInteger(market.tradeCount)} trades</em>
      </button>)}
    </div>
  </section>
}

function TradeTape({ trades }) {
  return <section className="TradeTape" aria-label="Recent trades">
    <div className="PanelHeader">
      <h2>Trade Tape</h2>
      <span>{trades.length}</span>
    </div>
    <div className="TradeTape-rows">
      {trades.length === 0 && <div className="TradeTape-empty">Waiting for public trades</div>}
      {trades.map(trade => <div className="TradeRow" key={tradeKey(trade)}>
        <span className="TradeRow-coin">{trade.coin}</span>
        <span className={`TradeRow-side TradeRow-side--${trade.side === 'sell' ? 'sell' : 'buy'}`}>
          {trade.side}
        </span>
        <span>{formatPrice(trade.price)}</span>
        <span>{formatSize(trade.size)}</span>
        <strong>{formatCurrency(trade.notional)}</strong>
        <time>{formatTime(trade.timeMs)}</time>
      </div>)}
    </div>
  </section>
}

function getCoveragePercent(coverage) {
  const observed = Number(coverage.observedWindowMs || 0)
  const configured = Number(coverage.configuredWindowMs || 24 * 60 * 60 * 1000)
  if (!configured) return 0
  return Math.max(4, Math.min(100, (observed / configured) * 100))
}

function formatPrice(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return '$0'
  return number.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: number >= 100 ? 2 : 4,
  })
}

function formatCurrency(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return '$0'
  return number.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  })
}

function formatSignedCurrency(value) {
  const formatted = formatCurrency(Math.abs(value))
  if (!value) return formatted
  return `${value > 0 ? '+' : '-'}${formatted}`
}

function formatInteger(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return '0'
  return number.toLocaleString()
}

function formatSize(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return '0'
  return number.toLocaleString(undefined, {
    maximumFractionDigits: 5,
  })
}

function formatTime(value) {
  const time = Number(value)
  if (!Number.isFinite(time)) return '--:--:--'
  return new Date(time).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function formatDuration(ms) {
  const seconds = Math.round(Number(ms || 0) / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  return `${Math.round(minutes / 60)}h`
}

function formatWindowHours(hours) {
  const value = Number(hours || 0)
  if (value <= 0) return '0h observed'
  if (value < 1) return `${Math.max(1, Math.round(value * 60))}m observed`
  return `${value.toFixed(value >= 10 ? 0 : 1)}h observed`
}
