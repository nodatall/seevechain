(async function() {
  const { Framework } = require('@vechain/connex-framework')
  const { Driver, SimpleNet } = require('@vechain/connex.driver-nodejs')
  const driver = await Driver.connect(new SimpleNet('https://vethor-node.vechain.com/'))
  const thor = new Framework(driver).thor
  const commands = require('../commands')
  const client = require('../database')
  global.thor = thor
  global.commands = commands
  global.client = client
  console.log('Thor loaded')
})()
