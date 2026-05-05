const recordUniqueVisitor = require('./recordUniqueVisitor')
const getAnalytics = require('./getAnalytics')
const marketData = require('./marketData')

module.exports = {
  recordUniqueVisitor,
  getAnalytics,
  ...marketData,
}
