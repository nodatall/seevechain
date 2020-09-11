const moment = require('moment')
const { oneDayAgo } = require('../lib/dateHelpers')
const CoinGecko = require('coingecko-api')
const CoinGeckoClient = new CoinGecko()

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

  if (cache[0] === blockRecord.number) {
    return cache[1]
  }

  const transactionsRecords = await client.query(
    `
      SELECT * FROM transactions
      WHERE block_number = $1;
    `,
    [blockRecord.number]
  )

  const transactionIds = transactionsRecords.map(transaction => transaction.id)

  const clauseRecords = transactionIds.length === 0
    ? []
    : await client.query(
      `
        SELECT * FROM CLAUSES
        WHERE transaction_id IN ($1:csv)
      `,
      [transactionIds]
    )

  const clausesByTransactionId = {}
  clauseRecords.forEach(clause => {
    if (!clausesByTransactionId[clause.transaction_id]) clausesByTransactionId[clause.transaction_id] = [clause]
    else clausesByTransactionId[clause.transaction_id].push(clause)
  })

  const before = oneDayAgo()
  const todaysStatsRecord = await client.one(
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

  const monthlyStatsRecords = await client.query(`SELECT * FROM daily_stats ORDER BY day DESC LIMIT 100`)

  const now = moment()
  const serverTime = now.add((+process.env.TIME_DIFFERENCE), 'hours').format('HH:mm MM/DD/YY')

  cache[0] = blockRecord.number
  cache[1] = {
    block: {
      id: blockRecord.id,
      number: Number(blockRecord.number),
      parentId: blockRecord.parent_id,
      timestamp: blockRecord.timestamp,
      gasUsed: Number(blockRecord.gas_used),
      signer: blockRecord.signer,
    },
    transactions: transactionsRecords.map(transaction => ({
      id: transaction.id,
      blockNumber: Number(transaction.block_number),
      contracts: transaction.contracts,
      delegator: transaction.delegator,
      origin: transaction.origin,
      gas: Number(transaction.gas),
      clauses: clausesByTransactionId[transaction.id] || [],
      vthoBurn: Number(transaction.vtho_burn),
      gasUsed: Number(transaction.gas_used),
      paid: transaction.paid,
      reward: transaction.reward,
      reverted: transaction.reverted,
    })),
    stats: {
      dailyTransactions: Number(todaysStatsRecord.dailytransactions),
      dailyClauses: Number(todaysStatsRecord.dailyclauses),
      dailyVTHOBurn: Number(todaysStatsRecord.dailyvthoburn),
    },
    monthlyStats: monthlyStatsRecords.map(record => ({
      day: moment(record.day).format('YYYY-MM-DD'),
      vthoBurn: record.vtho_burn,
      transactionCount: record.transaction_count,
      clauseCount: record.clause_count,
    })),
    serverTime,
    prices: await getTokenPrices(),
  }

  return cache[1]
}

async function getTokenPrices() {
  let prices
  try {
    prices = await CoinGeckoClient.simple.price({ ids: ['vechain', 'vethor-token']})
  } catch(error) {
    prices = {
      data: {
        ['vethor-token']: { usd: 0 },
        vechain: { usd: 0 },
      }
    }
  }

  return {
    vet: prices.data.vechain,
    vtho: prices.data['vethor-token'],
  }
}
