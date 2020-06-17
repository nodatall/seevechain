require('../environment')

const express = require('express')
const cookieParser = require('cookie-parser')
const compression = require('compression')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use(compression())
app.use(express.static('client/dist'))

app.use(cookieParser())

app.use(function(req, res, next) {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
  next()
})

require('./routes.js')(app, io)

app.use(function (err, req, res, next) {
  res.status(500).json({ error: err.message })
})

module.exports = {
  server,
  io,
}
