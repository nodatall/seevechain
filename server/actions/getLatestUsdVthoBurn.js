const queries = require('../queries')
const client = require('../database')

module.exports = async function() {
  return await queries.getCache({ client, cacheName: 'usdVthoBurn' })
}
