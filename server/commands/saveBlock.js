const moment = require('moment')

module.exports = async function({ client, block }) {
  try {
    await client.query(
      `
        INSERT INTO
          blocks (id, number, parent_id, timestamp, gas_used, signer)
        values
          ($1, $2, $3, $4, $5, $6)
      `,
      [
        block.id,
        block.number,
        block.parentID,
        moment.unix(block.timestamp).toDate().toISOString(),
        block.gasUsed,
        block.signer,
      ]
    )
  } catch(error) {
    console.log(error)
  }
}
