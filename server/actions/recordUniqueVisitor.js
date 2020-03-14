const commands = require('../commands')
const client = require('../database')

module.exports = async function(uid) {
  return await commands.recordUniqueVisitor({ client, uid })
}
