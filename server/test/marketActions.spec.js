const { expect } = require('chai')

const {
  getConfiguredCoins,
  getCurrentConnectionStatus,
  getLatestTradesFromClient,
  getMarketsFromClient,
  reconcileMarkets,
} = require('../actions/marketData')

describe('market data actions', () => {
  it('parses configured coins with defaults', () => {
    expect(getConfiguredCoins({})).to.deep.equal(['BTC', 'ETH', 'SOL', 'HYPE'])
    expect(getConfiguredCoins({ HYPERLIQUID_COINS: 'btc, eth, ,sol' })).to.deep.equal(['BTC', 'ETH', 'SOL'])
  })

  it('reconciles configured markets into storage', async () => {
    const queries = []
    const client = {
      query(sql, values) {
        queries.push({ sql, values })
        return Promise.resolve([])
      },
    }

    await reconcileMarkets({ client, coins: ['BTC', 'ETH'] })
    expect(queries[0].sql).to.include('INSERT INTO markets')
    expect(queries[0].sql).to.include('ON CONFLICT (coin) DO UPDATE')
    expect(queries[0].sql).not.to.include('enabled = EXCLUDED.enabled')
    expect(queries[0].values).to.deep.equal(['BTC', 'BTC', 'ETH', 'ETH'])
  })

  it('returns configured markets when the database has no rows', async () => {
    const client = {
      query() {
        return Promise.resolve([])
      },
    }

    const markets = await getMarketsFromClient({ client, coins: ['BTC', 'ETH'] })
    expect(markets).to.deep.equal([
      { coin: 'BTC', displayName: 'BTC', enabled: true },
      { coin: 'ETH', displayName: 'ETH', enabled: true },
    ])
  })

  it('filters database markets to configured enabled markets', async () => {
    const client = {
      query() {
        return Promise.resolve([
          { coin: 'ETH', display_name: 'Ethereum', enabled: true },
          { coin: 'DOGE', display_name: 'Dogecoin', enabled: true },
          { coin: 'BTC', display_name: 'Bitcoin', enabled: false },
        ])
      },
    }

    const markets = await getMarketsFromClient({ client, coins: ['BTC', 'ETH'] })
    expect(markets).to.deep.equal([
      { coin: 'ETH', displayName: 'Ethereum', enabled: true },
    ])
  })

  it('sanitizes latest trades from client rows', async () => {
    const client = {
      query() {
        return Promise.resolve([
          {
            coin: 'BTC',
            tid: 1,
            time_ms: 1710000000000,
            side: 'buy',
            raw_side: 'B',
            price: '60000',
            size: '0.1',
            notional: '6000',
            hash: '0xhash',
            buyer: '0xbuyer',
            seller: '0xseller',
            raw: { users: ['0xbuyer', '0xseller'] },
          },
        ])
      },
    }

    const trades = await getLatestTradesFromClient({ client, coin: 'BTC', limit: 10 })
    expect(trades[0]).not.to.have.property('buyer')
    expect(trades[0]).not.to.have.property('seller')
    expect(trades[0]).not.to.have.property('raw')
    expect(trades[0].coin).to.equal('BTC')
  })

  it('returns a connection status snapshot', () => {
    const status = getCurrentConnectionStatus({
      status: 'connected',
      connected: true,
      reconnecting: false,
      stale: false,
      gapAffected: false,
      coins: ['BTC'],
      lastStatusAt: 1710000000000,
    })

    expect(status).to.deep.equal({
      status: 'connected',
      connected: true,
      reconnecting: false,
      stale: false,
      gapAffected: false,
      coins: ['BTC'],
      updatedAt: 1710000000000,
    })
  })
})
