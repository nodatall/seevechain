const moment = require('moment')

const { oneDayAgo } = require('../lib/dateHelpers')

module.exports = async function({ client }) {

  const last30Records = await client.query(
    `
    SELECT * FROM daily_stats
    ORDER BY day DESC
    LIMIT 30
    `
  )

  let end = oneDayAgo()
  for (let i = 0; i < 30; i++) {
    const start = moment(end).subtract('24', 'hours').toDate().toISOString()
    if (!last30Records.find(record => moment(record.day).format('YYYY-MM-DD') === moment(end).format('YYYY-MM-DD'))) {
      const stats = await client.one(
        `
          SELECT
            sum(transactions.vtho_burn) AS dailyVTHOBurn,
            count(transactions.*) AS dailyTransactions,
            sum(transactions.clauses) AS dailyClauses
          FROM blocks
          JOIN transactions
          ON blocks.number = transactions.block_number
          WHERE blocks.timestamp BETWEEN $1 AND $2;
        `,
        [start, end]
      )
      await client.query(
        `
          INSERT INTO daily_stats (day, vtho_burn, transaction_count, clause_count)
          VALUES ($1::date, $2, $3, $4)
          ON CONFLICT (day) DO NOTHING
        `,
        [end, Math.round(stats.dailyvthoburn), stats.dailytransactions, stats.dailyclauses]
      )
    }
    end = start
  }
}
