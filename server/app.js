require('../environment')

const express = require('express')

const app = express()

app.use(express.static('client/dist'))

app.use(function(req, res, next) {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
  next()
})

require('./routes.js')(app)

app.use(function (err, req, res, next) {
  res.status(500)
  res.render('error', { error: err })
})

module.exports = app
