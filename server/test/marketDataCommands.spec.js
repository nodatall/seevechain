const { expect } = require('chai')

const { buildSaveTradesSql, toPublicTrade } = require('../commands/saveTrades')
const {
  buildMarketStats,
  createEmptyMarketStats,
} = require('../commands/processMarketStats')
const { getRetentionHours } = require('../commands/pruneOldTrades')

describe('market data commands', () => {
  it('builds deduped trade insert SQL and values', () => {
    const { sql, values } = buildSaveTradesSql([
      {
        coin: 'BTC',
        tid: 1,
        timeMs: 1710000000000,
        side: 'buy',
        rawSide: 'B',
        price: '60000',
        size: '0.1',
        notional: '6000',
        hash: '0xhash',
        buyer: '0xbuyer',
        seller: '0xseller',
        raw: { users: ['0xbuyer', '0xseller'] },
      },
    ])

    expect(sql).to.include('ON CONFLICT (coin, time_ms, tid) DO NOTHING')
    expect(values).to.deep.equal([
      'BTC',
      1,
      1710000000000,
      'buy',
      'B',
      '60000',
      '0.1',
      '6000',
      '0xhash',
      '0xbuyer',
      '0xseller',
      JSON.stringify({ users: ['0xbuyer', '0xseller'] }),
    ])
  })

  it('omits internal wallet/raw fields from public trade payloads', () => {
    const publicTrade = toPublicTrade({
      coin: 'ETH',
      tid: 2,
      time_ms: 1710000000001,
      side: 'sell',
      raw_side: 'A',
      price: '3000',
      size: '0.5',
      notional: '1500',
      hash: '0xhash2',
      buyer: '0xbuyer',
      seller: '0xseller',
      raw: { users: ['0xbuyer', '0xseller'] },
      created_at: 'ignored',
    })

    expect(publicTrade).to.deep.equal({
      coin: 'ETH',
      tid: 2,
      timeMs: 1710000000001,
      side: 'sell',
      rawSide: 'A',
      price: '3000',
      size: '0.5',
      notional: '1500',
      hash: '0xhash2',
    })
    expect(publicTrade).not.to.have.property('buyer')
    expect(publicTrade).not.to.have.property('seller')
    expect(publicTrade).not.to.have.property('raw')
  })

  it('computes observed market stats with side buckets and gap metadata', () => {
    const nowMs = 1710003600000
    const stats = buildMarketStats({
      trades: [
        {
          coin: 'BTC',
          tid: 1,
          time_ms: 1710000000000,
          side: 'buy',
          raw_side: 'B',
          price: '60000',
          size: '0.1',
          notional: '6000',
          hash: null,
        },
        {
          coin: 'BTC',
          tid: 2,
          time_ms: 1710000100000,
          side: 'sell',
          raw_side: 'A',
          price: '61000',
          size: '0.05',
          notional: '3050',
          hash: null,
        },
      ],
      feedStatusEvents: [
        {
          event_type: 'gap',
          started_at: new Date(1710000200000).toISOString(),
          ended_at: new Date(1710000300000).toISOString(),
        },
      ],
      nowMs,
      configuredCoins: ['BTC', 'ETH'],
    })

    expect(stats.markets.BTC.tradeCount).to.equal(2)
    expect(stats.markets.BTC.buyNotional).to.equal('6000')
    expect(stats.markets.BTC.sellNotional).to.equal('3050')
    expect(stats.markets.BTC.imbalance).to.equal('2950')
    expect(stats.markets.BTC.latestPrice).to.equal('61000')
    expect(stats.coverage.gapAffected).to.equal(true)
    expect(stats.topMarkets[0].coin).to.equal('BTC')
    expect(stats.latestTrades).to.have.length(2)
  })

  it('returns empty stats for configured markets', () => {
    const stats = createEmptyMarketStats({ configuredCoins: ['BTC'], nowMs: 1710003600000 })
    expect(stats.markets.BTC.tradeCount).to.equal(0)
    expect(stats.coverage.observedWindowMs).to.equal(0)
  })

  it('defaults retention to 48 hours', () => {
    expect(getRetentionHours({})).to.equal(48)
    expect(getRetentionHours({ TRADE_RETENTION_HOURS: '12' })).to.equal(12)
  })
})
