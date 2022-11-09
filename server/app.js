require('../environment')

const sslRedirect = require('heroku-ssl-redirect').default
const express = require('express')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const { exec } = require('child_process')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const logger = require('./lib/logger')
const cron = require('./lib/cron')

app.use(compression())
app.use(sslRedirect())
app.use(express.static('client/dist'))

app.use(cookieParser())

app.use(function(req, res, next) {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
  next()
})

app.use(function(req, res, next) {
  req.logger = logger

  res.renderError = function(error) {
    logger.error('RENDERING ERROR', error.message)
    const errorAsString = typeof error === 'string' ? error : error.message
    res.status(error.status || 200)
    res.json({
      success: false,
      error: errorAsString,
    })
  }

  res.renderSuccess = function(json={}) {
    res.json(
      Object.assign(json, {success: true})
    )
  }

  if (req.method === 'OPTIONS'){
    res.end()
  }else{
    next()
  }
})

app.promiseRoute = function route(method, pattern, ...middleware){
  const handler = middleware.pop()
  app[method](pattern, ...middleware, (req, res, _next) => {
    let nextCalled = false
    const next = (...args) => { nextCalled = true; _next(...args) }
    handler({ logger: req.logger, req, res, next }).then(
      result => {
        if (nextCalled) return
        if (!res.headersSent) res.renderSuccess(result)
      },
      error => {
        if (nextCalled) return
        if (!res.headersSent) {
          if (error.status){ res.status(error.status) }
          res.renderError(error)
        }
      }
    )
  })
}

require('./routes.js')(app, io)

app.use(function (err, req, res, next) {
  res.status(500).json({ error: err.message })
})

cron.schedule('0 0 * * *', async () => { // daily
  if (process.env.NODE_ENV === 'production') {
    exec('node ./scripts/deleteOldBlocks', () => {})
  }
})

module.exports = {
  server,
  io,
}
