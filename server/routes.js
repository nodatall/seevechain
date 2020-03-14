const actions = require('./actions')
const path = require('path')

module.exports = function(app) {
  app.use(function (req, res, next) {
    if (req.cookies.seeVechainUid) {
      actions.recordUniqueVisitor(req.cookies.seeVechainUid)
    }
    next()
  })

  app.get('/api/latest', (req, res, next) => {
    actions.getLatest().then(
      ({ block, transactions, stats }) => {
        res.json({
          block,
          transactions,
          stats,
        })
      },
      error => { next(error) },
    )
  })

  app.get('/api/visitor_analytics', (req, res, next) => {
    actions.getAnalytics().then(
      analytics => {
        res.json(analytics)
      },
      error => { next(error) },
    )
  })

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../client/dist/index.html'))
  })
}
