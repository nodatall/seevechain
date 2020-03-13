const moment = require('moment')

module.exports = async function({ client, block }) {
  await client.query(
    `
      INSERT INTO
        blocks (id, number, parent_id, timestamp, gas_used, signer, number_of_transactions)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (number) DO UPDATE
      SET
        id = EXCLUDED.id,
        parent_id = EXCLUDED.parent_id,
        timestamp = EXCLUDED.timestamp,
        gas_used = EXCLUDED.gas_used,
        signer = EXCLUDED.signer,
        number_of_transactions = EXCLUDED.number_of_transactions;
    `,
    [
      block.id,
      block.number,
      block.parentID,
      moment.unix(block.timestamp).toDate().toISOString(),
      block.gasUsed,
      block.signer,
      block.transactions.length,
    ]
  )
}
