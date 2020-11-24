const { oneDayAgo } = require('../lib/dateHelpers')

const cache = []

module.exports = async function(client) {
  const blockRecord = await client.one(
    `
      SELECT * FROM blocks
      ORDER BY number DESC
      LIMIT 1;
    `
  )

  if (!blockRecord) throw new Error('no block found')
  if (cache[0] === blockRecord.number) return cache[1]

  const before = oneDayAgo()

  const topContractRecords = await client.query(
    `
    SELECT
      contract,
      count(*) AS totalclauses,
      SUM(vtho_burn) AS totalburn
    FROM
      clauses
    WHERE
      contract IS NOT NULL
    AND
      created_at > $1
    GROUP BY contract
    LIMIT 20;
    `,
    [before]
  )

  cache[0] = blockRecord.number
  cache[1] = {
    topContracts: topContractRecords.map(record => ({
      contract: record.contract,
      clauses: Number(record.totalclauses),
      vthoBurn: Number(record.totalburn),
    }))
  }

  return cache[1]
}
