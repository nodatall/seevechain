const SORTED_TYPES = ['Data', 'Transfer', 'New Contract']

const bigNumber = require('bignumber.js')

module.exports = async function({ client, transaction, block, receipt }) {
  const contracts = new Set()
  const types = new Set()
  let transfers = 0
  transaction.clauses.forEach(clause => {
    if (clause.to) {
      if (clause.data === '0x') {
        types.add('Transfer')
        transfers += bigNumber(clause.value, 16).dividedBy(Math.pow(10, 18)).toFixed(0)
      } else {
        types.add('Data')
        contracts.add(clause.to)
      }
    } else {
      types.add('New Contract')
    }
  })
  const sortedTypes = []
  SORTED_TYPES.forEach(type => {
    if (types.has(type)) sortedTypes.push(type)
  })
  if (!sortedTypes.length) sortedTypes.push('Unknown')

  const vthoBurn = ((receipt.gasUsed + (receipt.gasUsed * ((transaction.gasPriceCoef || 0) / 255))) / 1000) * .7

  await client.query(
    `
      INSERT INTO
        transactions (
          id,
          block_number,
          origin,
          contracts,
          delegator,
          gas,
          clauses,
          vtho_burn,
          gas_used,
          paid,
          reward,
          types,
          transfers
        )
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (id) DO UPDATE
        SET
          block_number = EXCLUDED.block_number,
          origin = EXCLUDED.origin,
          delegator = EXCLUDED.delegator,
          gas = EXCLUDED.gas,
          clauses = EXCLUDED.clauses,
          vtho_burn = EXCLUDED.vtho_burn,
          gas_used = EXCLUDED.gas_used,
          paid = EXCLUDED.paid,
          reward = EXCLUDED.reward,
          types = EXCLUDED.types,
          transfers = EXCLUDED.transfers;
    `,
    [
      transaction.id,
      block.number,
      transaction.origin,
      [...contracts].join(', '),
      transaction.delegator,
      transaction.gas,
      transaction.clauses.length,
      vthoBurn,
      receipt.gasUsed,
      receipt.paid,
      receipt.reward,
      sortedTypes.join(', '),
      transfers,
    ]
  )
}
