const { Framework } = require('@vechain/connex-framework')
const { Driver, SimpleNet } = require('@vechain/connex.driver-nodejs')

module.exports = (async function() {
  const driver = await Driver.connect(new SimpleNet('https://mainnet.veblocks.net/'))
  const thor = new Framework(driver).thor
  const tick = thor.ticker()

  return { thor, tick }
})()
