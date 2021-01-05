const { oneDayAgo } = require('../lib/dateHelpers')
const saveCache = require('./saveCache')

module.exports = async function(client) {
  const before = oneDayAgo()
  const topContractRecords = await client.query(
    `
    SELECT
      contract,
      count(*) AS totalclauses,
      SUM(vtho_burn) AS totalburn,
      SUM(vtho_burn_usd) AS usdburned
    FROM
      clauses
    WHERE
      contract IS NOT NULL
    AND
      created_at > $1
    GROUP BY contract
    `,
    [before]
  )

  const processed = {
    topContracts: topContractRecords.map(record => ({
      contract: record.contract,
      clauses: Number(record.totalclauses),
      vthoBurn: Number(record.totalburn),
      usdBurned: Number(record.usdburned).toFixed(2),
    }))
  }

  await saveCache({
    client,
    cacheName: 'topContracts',
    cache: JSON.stringify(processed),
  })

  return processed
}
