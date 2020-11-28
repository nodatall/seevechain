const { oneDayAgo } = require('../lib/dateHelpers')
const saveCache = require('./saveCache')

module.exports = async function(client) {
  const before = oneDayAgo()
  const topContractRecords = await client.query(
    `
    SELECT
      contract,
      SUM(vtho_burn_usd) AS usdburn
    FROM
      clauses
    WHERE
      contract IS NOT NULL
    AND
      created_at > $1
    GROUP BY contract
    ORDER BY usdburn DESC;
    `,
    [before]
  )

  const transactionsUsdBurnRecord = await client.one(
    `
      SELECT sum(transactions.vtho_burn_usd) AS usdburn
      FROM transactions
      WHERE created_at > $1;
    `,
    [before]
  )

  const processed = {
    topContracts: topContractRecords.map(record => ({
      contract: record.contract,
      usdBurned: Number(record.usdburn).toFixed(2),
    })),
    dailyBurnUsd: transactionsUsdBurnRecord.usdburn,
  }

  await saveCache({
    client,
    cacheName: 'usdVthoBurn',
    cache: JSON.stringify(processed),
  })

  return processed
}
