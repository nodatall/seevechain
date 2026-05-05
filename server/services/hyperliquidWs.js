const EventEmitter = require('events')
const BigNumber = require('bignumber.js')
const WebSocket = require('ws')

const DEFAULT_WS_URL = 'wss://api.hyperliquid.xyz/ws'
const DEFAULT_COINS = ['BTC', 'ETH', 'SOL', 'HYPE']
const DEFAULT_HEARTBEAT_INTERVAL_MS = 15000
const DEFAULT_STALE_AFTER_MS = 45000
const DEFAULT_RECONNECT_BASE_MS = 1000
const DEFAULT_RECONNECT_MAX_MS = 30000

function normalizeCoin(coin){
  return String(coin || '').trim().toUpperCase()
}

function normalizeCoins(coins){
  return (coins || DEFAULT_COINS).map(normalizeCoin).filter(Boolean)
}

function buildSubscribeMessage(coin){
  return {
    method: 'subscribe',
    subscription: {
      type: 'trades',
      coin: normalizeCoin(coin),
    },
  }
}

function normalizeDecimal(value){
  if (value === undefined || value === null) return null
  return String(value)
}

function decimalProduct(left, right){
  const leftDecimal = new BigNumber(normalizeDecimal(left) || 0)
  const rightDecimal = new BigNumber(normalizeDecimal(right) || 0)
  return leftDecimal.times(rightDecimal).toFixed()
}

function mapSide(rawSide){
  if (rawSide === 'B') return 'buy'
  if (rawSide === 'A') return 'sell'
  return rawSide ? String(rawSide).toLowerCase() : null
}

function normalizeTrade(trade){
  const rawSide = trade.side
  const users = Array.isArray(trade.users) ? trade.users : []
  const price = normalizeDecimal(trade.px || trade.price)
  const size = normalizeDecimal(trade.sz || trade.size)

  return {
    coin: normalizeCoin(trade.coin),
    side: mapSide(rawSide),
    rawSide,
    price,
    size,
    notional: decimalProduct(price, size),
    hash: trade.hash || null,
    timeMs: trade.time || trade.timeMs || null,
    tid: trade.tid || null,
    buyer: users[0] || trade.buyer || null,
    seller: users[1] || trade.seller || null,
    raw: trade,
  }
}

function looksLikeTrade(value){
  return !!(
    value &&
    typeof value === 'object' &&
    (value.coin || value.px || value.price) &&
    (value.sz || value.size) &&
    value.side
  )
}

function extractTrades(data){
  if (!data) return []
  if (Array.isArray(data)) return data.filter(looksLikeTrade)
  if (looksLikeTrade(data)) return [data]
  if (Array.isArray(data.trades)) return data.trades.filter(looksLikeTrade)
  if (Array.isArray(data.data)) return data.data.filter(looksLikeTrade)
  if (data.trade && looksLikeTrade(data.trade)) return [data.trade]
  return []
}

function parsePayload(message){
  if (Buffer.isBuffer(message)) return JSON.parse(message.toString('utf8'))
  if (typeof message === 'string') return JSON.parse(message)
  return message
}

function parseHyperliquidMessage(message){
  let payload

  try {
    payload = parsePayload(message)
  } catch (error) {
    return {
      type: 'invalid',
      channel: null,
      trades: [],
      error,
      raw: message,
    }
  }

  const channel = payload && payload.channel
  const type = channel || (payload && payload.type) || 'unknown'

  if (type === 'subscriptionResponse') {
    return {
      type,
      channel,
      trades: [],
      statusEvent: 'subscriptionResponse',
      raw: payload,
    }
  }

  const rawTrades = type === 'trades' ? extractTrades(payload.data) : extractTrades(payload)

  return {
    type,
    channel,
    trades: rawTrades.map(normalizeTrade),
    raw: payload,
  }
}

function createInitialStatus(coins, options){
  const at = options && options.at ? options.at : null

  return {
    status: 'initialized',
    coins: normalizeCoins(coins),
    connected: false,
    reconnecting: false,
    stale: false,
    gapAffected: false,
    lastConnectedAt: null,
    lastDisconnectedAt: null,
    lastMessageAt: null,
    lastPongAt: null,
    lastStatusAt: at,
    reconnectAttempt: 0,
    error: null,
  }
}

function updateStatus(currentStatus, eventType, details){
  const status = { ...currentStatus }
  const eventDetails = details || {}
  const at = eventDetails.at || Date.now()

  status.status = eventType
  status.lastStatusAt = at

  if (eventType === 'connected') {
    status.connected = true
    status.reconnecting = false
    status.stale = false
    status.gapAffected = false
    status.lastConnectedAt = at
    status.reconnectAttempt = 0
    status.error = null
  } else if (eventType === 'disconnected') {
    status.connected = false
    status.reconnecting = true
    status.stale = false
    status.gapAffected = true
    status.lastDisconnectedAt = at
  } else if (eventType === 'stale') {
    status.connected = false
    status.reconnecting = true
    status.stale = true
    status.gapAffected = true
  } else if (eventType === 'reconnecting') {
    status.connected = false
    status.reconnecting = true
    status.gapAffected = true
    status.reconnectAttempt = eventDetails.reconnectAttempt || status.reconnectAttempt
  } else if (eventType === 'message') {
    status.lastMessageAt = at
    status.stale = false
  } else if (eventType === 'pong') {
    status.lastPongAt = at
  } else if (eventType === 'error') {
    status.error = eventDetails.error || null
  }

  return status
}

class HyperliquidWsService extends EventEmitter {
  constructor(options){
    super()

    const serviceOptions = options || {}

    this.wsUrl = serviceOptions.wsUrl || serviceOptions.url || DEFAULT_WS_URL
    this.coins = normalizeCoins(serviceOptions.coins)
    this.WebSocket = serviceOptions.WebSocket || serviceOptions.WebSocketCtor || WebSocket
    this.setTimeout = serviceOptions.setTimeout || setTimeout
    this.clearTimeout = serviceOptions.clearTimeout || clearTimeout
    this.setInterval = serviceOptions.setInterval || setInterval
    this.clearInterval = serviceOptions.clearInterval || clearInterval
    this.now = serviceOptions.now || Date.now
    this.heartbeatIntervalMs = serviceOptions.heartbeatIntervalMs || DEFAULT_HEARTBEAT_INTERVAL_MS
    this.staleAfterMs = serviceOptions.staleAfterMs || DEFAULT_STALE_AFTER_MS
    this.reconnectBaseMs = serviceOptions.reconnectBaseMs || DEFAULT_RECONNECT_BASE_MS
    this.reconnectMaxMs = serviceOptions.reconnectMaxMs || DEFAULT_RECONNECT_MAX_MS
    this.logger = serviceOptions.logger || null

    this.socket = null
    this.status = createInitialStatus(this.coins, { at: this.now() })
    this.reconnectTimer = null
    this.heartbeatTimer = null
    this.staleTimer = null
    this.reconnectAttempt = 0
    this.stopped = true
  }

  start(){
    if (!this.stopped) return this

    this.stopped = false
    this.connect()
    return this
  }

  connect(){
    if (this.stopped) return this

    this.clearReconnectTimer()
    this.socket = new this.WebSocket(this.wsUrl)
    this.bindSocket(this.socket)
    return this
  }

  stop(){
    this.stopped = true
    this.clearReconnectTimer()
    this.clearHeartbeatTimer()
    this.clearStaleTimer()

    if (this.socket) {
      const socket = this.socket
      this.socket = null
      if (typeof socket.close === 'function') socket.close()
    }

    return this
  }

  bindSocket(socket){
    socket.on('open', () => this.handleOpen())
    socket.on('message', message => this.handleMessage(message))
    socket.on('pong', () => this.handlePong())
    socket.on('close', (code, reason) => this.handleClose(code, reason))
    socket.on('error', error => this.handleError(error))
  }

  handleOpen(){
    this.reconnectAttempt = 0
    this.setStatus('connected')
    this.emit('connected', this.status)
    this.subscribeAll()
    this.startHeartbeat()
    this.scheduleStaleCheck()
  }

  subscribeAll(){
    this.coins.forEach(coin => this.send(buildSubscribeMessage(coin)))
  }

  send(payload){
    if (!this.socket || typeof this.socket.send !== 'function') return false

    const readyState = this.socket.readyState
    const openState = this.WebSocket.OPEN === undefined ? 1 : this.WebSocket.OPEN
    if (readyState !== undefined && readyState !== openState) return false

    this.socket.send(JSON.stringify(payload))
    return true
  }

  handleMessage(message){
    const parsed = parseHyperliquidMessage(message)

    if (parsed.type === 'invalid') {
      this.emit('error', parsed.error)
      return
    }

    this.setStatus('message')
    this.scheduleStaleCheck()

    if (parsed.statusEvent) {
      this.emit('status', {
        type: parsed.statusEvent,
        status: this.status,
        raw: parsed.raw,
      })
    }

    if (parsed.trades.length) {
      this.emit('trades', parsed.trades, parsed)
    }
  }

  handlePong(){
    this.setStatus('pong')
  }

  handleClose(code, reason){
    this.clearHeartbeatTimer()
    this.clearStaleTimer()

    if (this.stopped) return

    this.setStatus('disconnected')
    this.emit('disconnected', {
      code,
      reason,
      status: this.status,
    })
    this.emit('gap', {
      type: 'disconnected',
      status: this.status,
      code,
      reason,
    })
    this.scheduleReconnect()
  }

  handleError(error){
    this.setStatus('error', { error })
    this.emit('error', error)
  }

  startHeartbeat(){
    this.clearHeartbeatTimer()

    this.heartbeatTimer = this.setInterval(() => {
      if (!this.socket || typeof this.socket.ping !== 'function') return
      this.socket.ping()
    }, this.heartbeatIntervalMs)
  }

  scheduleStaleCheck(){
    this.clearStaleTimer()

    this.staleTimer = this.setTimeout(() => {
      if (this.stopped) return

      this.setStatus('stale')
      this.emit('stale', this.status)
      this.emit('gap', {
        type: 'stale',
        status: this.status,
      })

      if (this.socket && typeof this.socket.close === 'function') this.socket.close()
      this.scheduleReconnect()
    }, this.staleAfterMs)
  }

  scheduleReconnect(){
    if (this.stopped || this.reconnectTimer) return

    this.reconnectAttempt += 1
    this.setStatus('reconnecting', {
      reconnectAttempt: this.reconnectAttempt,
    })

    const delay = Math.min(
      this.reconnectBaseMs * Math.pow(2, this.reconnectAttempt - 1),
      this.reconnectMaxMs
    )

    this.emit('reconnecting', {
      delay,
      attempt: this.reconnectAttempt,
      status: this.status,
    })

    this.reconnectTimer = this.setTimeout(() => {
      this.reconnectTimer = null
      this.connect()
    }, delay)
  }

  setStatus(eventType, details){
    const eventDetails = {
      ...(details || {}),
      at: this.now(),
    }
    this.status = updateStatus(this.status, eventType, eventDetails)
    this.emit('status', {
      type: eventType,
      status: this.status,
      details: eventDetails,
    })
    return this.status
  }

  clearReconnectTimer(){
    if (!this.reconnectTimer) return
    this.clearTimeout(this.reconnectTimer)
    this.reconnectTimer = null
  }

  clearHeartbeatTimer(){
    if (!this.heartbeatTimer) return
    this.clearInterval(this.heartbeatTimer)
    this.heartbeatTimer = null
  }

  clearStaleTimer(){
    if (!this.staleTimer) return
    this.clearTimeout(this.staleTimer)
    this.staleTimer = null
  }
}

function createHyperliquidWsService(options){
  return new HyperliquidWsService(options)
}

module.exports = {
  HyperliquidWsService,
  buildSubscribeMessage,
  createHyperliquidWsService,
  createInitialStatus,
  normalizeTrade,
  parseHyperliquidMessage,
  updateStatus,
}
