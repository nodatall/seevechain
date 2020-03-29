const actions = require('./actions')
const path = require('path')

module.exports = function(app, io) {
  app.use(function (req, res, next) {
    if (req.cookies.seeVechainUid) {
      actions.recordUniqueVisitor(req.cookies.seeVechainUid)
    }
    next()
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

  io.on('connection', function (socket) {
    socket.on('clientAskForLatest', async function (data) {
      await actions.recordUniqueVisitor(data.seeVechainUid)
      socket.emit('serverSendLatest', await actions.getLatest())
    })
  })
}
