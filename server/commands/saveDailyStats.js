const moment = require('moment')

const { oneDayAgo } = require('../lib/dateHelpers')

module.exports = async function({ client }) {
  const end = oneDayAgo()
  const existingRecord = await client.oneOrNone('SELECT * FROM daily_stats WHERE day = $1', [end])
  if (existingRecord) return
  const start = moment(end).subtract('24', 'hours').toDate().toISOString()
  const stats = await client.one(
    `
      SELECT
        sum(transactions.vtho_burn) AS dailyVTHOBurn,
        count(transactions.*) AS dailyTransactions,
        sum(transactions.clauses) AS dailyClauses,
        sum(transactions.vtho_burn_usd) AS dailyvthoburnusd
      FROM transactions
      WHERE transactions.created_at BETWEEN $1 AND $2;
    `,
    [start, end]
  )
  await client.query(
    `
      INSERT INTO daily_stats (day, vtho_burn, transaction_count, clause_count, vtho_burn_usd)
      VALUES ($1::date, $2, $3, $4, $5)
      ON CONFLICT (day) DO NOTHING
    `,
    [
      end,
      Math.round(stats.dailyvthoburn),
      stats.dailytransactions,
      stats.dailyclauses,
      stats.dailyvthoburnusd
    ]
  )
}
