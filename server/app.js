require('../environment')

const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()

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

module.exports = app
