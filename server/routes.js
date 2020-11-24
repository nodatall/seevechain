const actions = require('./actions')
const path = require('path')

module.exports = function(app, io) {
  app.use(function (req, res, next) {
    if (req.cookies.seeVechainUid) {
      actions.recordUniqueVisitor(req.cookies.seeVechainUid)
    }
    next()
  })

  app.promiseRoute('get', '/api/visitor_analytics', async () => {
    return await actions.getAnalytics()
  })

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../client/dist/index.html'))
  })

  io.on('connection', function (socket) {
    socket.on('clientAskForLatest', async function (data) {
      await actions.recordUniqueVisitor(data.seeVechainUid)
      socket.emit('serverSendLatest', await actions.getLatest())
      socket.emit('serverSendTopContracts', await actions.getTopContracts())
    })
  })
}
