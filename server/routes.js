const getLatest = require('./actions/getLatest')

module.exports = function(app) {
  app.get('/latest', (req, res, next) => {
    getLatest().then(
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
}
