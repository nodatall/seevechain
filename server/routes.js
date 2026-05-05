const actions = require('./actions')
const path = require('path')

module.exports = function(app, io) {
  app.use(function (req, res, next) {
    if (req.cookies.seeVechainUid) {
      actions.recordUniqueVisitor(req.cookies.seeVechainUid)
    }
    next()
  })

  app.promiseRoute('get', '/api/health', async () => {
    return await actions.getHealth()
  })

  app.promiseRoute('get', '/api/markets', async () => {
    return {
      markets: await actions.getMarkets(),
    }
  })

  app.promiseRoute('get', '/api/trades', async ({ req }) => {
    return {
      trades: await actions.getLatestTrades({
        coin: req.query.coin,
        limit: req.query.limit,
      }),
    }
  })

  app.promiseRoute('get', '/api/market_stats', async () => {
    return {
      marketStats: await actions.getMarketStats(),
    }
  })

  app.promiseRoute('get', '/api/visitor_analytics', async () => {
    return await actions.getAnalytics()
  })

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../client/dist/index.html'))
  })

  io.on('connection', function (socket) {
    socket.on('clientAskForLatest', async function (data) {
      if (data && data.seeVechainUid) {
        await actions.recordUniqueVisitor(data.seeVechainUid)
      }

      socket.emit('serverSendMarketStats', await actions.getMarketStats())
      socket.emit('serverSendTrades', await actions.getLatestTrades())
      socket.emit('serverSendConnectionStatus', actions.getCurrentConnectionStatus())
    })
  })
}
