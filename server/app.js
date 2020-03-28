require('../environment')

const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const actions = require('./actions')

app.use(express.static('client/dist'))

app.use(cookieParser())

app.use(function(req, res, next) {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
  next()
})

require('./routes.js')(app)

app.use(function (err, req, res, next) {
  res.status(500).json({ error: err.message })
})

io.on('connection', function (socket) {
  socket.on('clientAskForLatest', async function () {
    socket.emit('serverSendLatest', await actions.getLatest())
  })
})

module.exports = {
  server,
  io,
}
