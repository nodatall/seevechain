const moment = require('moment')
const numeral = require('numeral')

module.exports = async function(client) {
  const blockRecord = await client.one(
    `
      SELECT * FROM blocks
      ORDER BY timestamp DESC
      LIMIT 1;
    `
  )

  if (!blockRecord) throw new Error('no block found')

  const transactionsRecords = await client.query(
    `
      SELECT * FROM transactions
      WHERE block_number = $1;
    `,
    [blockRecord.number]
  )

  const now = moment()
  const before = moment()
    .subtract((+process.env.TIME_DIFFERENCE + +now.format('HH')) % 24, 'hours')
    .subtract(+now.format('mm'), 'minutes')
    .subtract(+now.format('ss'), 'seconds')
    .toDate()
    .toISOString()

  const stats = await client.one(
    `
      SELECT
        sum(transactions.vtho_burn) AS dailyVTHOBurn,
        count(transactions.*) AS dailyTransactions,
        sum(transactions.clauses) AS dailyClauses
      FROM blocks
      JOIN transactions
      ON blocks.number = transactions.block_number
      WHERE blocks.timestamp > $1;
    `,
    [before]
  )

  return {
    block: {
      id: blockRecord.id,
      number: blockRecord.number,
      parentId: blockRecord.parent_id,
      timestamp: blockRecord.timestamp,
      gasUsed: blockRecord.gas_used,
      signer: blockRecord.signer,
    },
    transactions: transactionsRecords.map(transaction => ({
      id: transaction.id,
      blockNumber: transaction.block_number,
      contracts: transaction.contracts,
      delegator: transaction.delegator,
      origin: transaction.origin,
      gas: transaction.gas,
      clauses: transaction.clauses,
      vthoBurn: transaction.vtho_burn,
      gasUsed: transaction.gas_used,
      paid: transaction.paid,
      reward: transaction.reward,
      types: transaction.types,
      transfers: numeral(transaction.transfers).format('0.00a'),
    })),
    stats: {
      dailyTransactions: +stats.dailytransactions,
      dailyClauses: +stats.dailyclauses,
      dailyVTHOBurn: +stats.dailyvthoburn,
    },
  }

}
