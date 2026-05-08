const { expect } = require('chai')

const {
  buildPingMessage,
  buildSubscribeMessage,
  createInitialStatus,
  normalizeTrade,
  parseHyperliquidMessage,
  updateStatus,
} = require('../services/hyperliquidWs')

describe('hyperliquid websocket helpers', () => {
  it('builds public trade subscription messages', () => {
    expect(buildSubscribeMessage('sol')).to.deep.equal({
      method: 'subscribe',
      subscription: { type: 'trades', coin: 'SOL' },
    })
  })

  it('builds Hyperliquid application heartbeat messages', () => {
    expect(buildPingMessage()).to.deep.equal({
      method: 'ping',
    })
  })

  it('normalizes B and A trades with decimal-safe notional strings', () => {
    const buy = normalizeTrade({
      coin: 'SOL',
      side: 'B',
      px: '123.45',
      sz: '2.5',
      hash: '0xabc',
      time: 1710000000000,
      tid: 42,
      users: ['0xbuyer', '0xseller'],
    })

    const sell = normalizeTrade({
      coin: 'ETH',
      side: 'A',
      px: '3000.10',
      sz: '0.02',
      time: 1710000000001,
      tid: 43,
      users: ['0xbuyer2', '0xseller2'],
    })

    expect(buy).to.include({
      coin: 'SOL',
      side: 'buy',
      rawSide: 'B',
      price: '123.45',
      size: '2.5',
      notional: '308.625',
      hash: '0xabc',
      timeMs: 1710000000000,
      tid: 42,
      buyer: '0xbuyer',
      seller: '0xseller',
    })
    expect(sell.side).to.equal('sell')
    expect(sell.rawSide).to.equal('A')
    expect(sell.notional).to.equal('60.002')
  })

  it('parses trade messages while treating pure subscription responses as status only', () => {
    const ack = parseHyperliquidMessage(JSON.stringify({
      channel: 'subscriptionResponse',
      data: { method: 'subscribe' },
    }))
    expect(ack.type).to.equal('subscriptionResponse')
    expect(ack.trades).to.deep.equal([])

    const tradeMessage = parseHyperliquidMessage(JSON.stringify({
      channel: 'trades',
      data: [
        {
          coin: 'BTC',
          side: 'B',
          px: '60000',
          sz: '0.1',
          time: 1710000000002,
          tid: 44,
        },
      ],
    }))

    expect(tradeMessage.type).to.equal('trades')
    expect(tradeMessage.trades).to.have.length(1)
    expect(tradeMessage.trades[0]).to.include({
      coin: 'BTC',
      side: 'buy',
      rawSide: 'B',
      notional: '6000',
    })
  })

  it('updates connection status without requiring persistence in the service', () => {
    const initial = createInitialStatus(['BTC', 'ETH'])
    const connected = updateStatus(initial, 'connected', { at: 1710000000003 })
    const stale = updateStatus(connected, 'stale', { at: 1710000001003 })

    expect(connected).to.include({
      status: 'connected',
      connected: true,
      reconnecting: false,
      stale: false,
      gapAffected: false,
    })
    expect(connected.coins).to.deep.equal(['BTC', 'ETH'])
    expect(stale).to.include({
      status: 'stale',
      connected: false,
      reconnecting: true,
      stale: true,
      gapAffected: true,
    })
  })
})
