(async function() {
  const { Framework } = require('@vechain/connex-framework')
  const { Driver, SimpleNet } = require('@vechain/connex.driver-nodejs')
  const driver = await Driver.connect(new SimpleNet('https://vethor-node.vechain.com/'))
  const thor = new Framework(driver).thor
  global.thor = thor
  console.log('Thor loaded')
})()
