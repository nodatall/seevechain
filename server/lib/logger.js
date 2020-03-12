const pino = require('pino')

const options = {
  prettyPrint: true,
}
const logger = pino(options, pino.destination('./logs.txt'))

module.exports = logger
