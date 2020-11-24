const bigNumber = require('bignumber.js')
const { ABI_SIGNATURES } = require('../lib/abiSignatures')
const { TOKEN_CONTRACTS, KNOWN_CONTRACTS } = require('../../shared/knownAddresses')
const { abi } = require('thor-devkit')
const knex = require ('../database/knex')
const moment = require('moment')

module.exports = async function({ client, transaction, block, receipt, thor }) {

  const vthoBurn = ((receipt.gasUsed + (receipt.gasUsed * ((transaction.gasPriceCoef || 0) / 255))) / 1000) * .7
  const createdAt = moment.unix(block.timestamp).toDate().toISOString()

  await client.query(
    `
      INSERT INTO
        transactions (
          id,
          block_number,
          origin,
          delegator,
          gas,
          vtho_burn,
          gas_used,
          paid,
          reward,
          clauses,
          reverted,
          created_at
        )
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO UPDATE
        SET
          block_number = EXCLUDED.block_number,
          origin = EXCLUDED.origin,
          delegator = EXCLUDED.delegator,
          gas = EXCLUDED.gas,
          vtho_burn = EXCLUDED.vtho_burn,
          gas_used = EXCLUDED.gas_used,
          paid = EXCLUDED.paid,
          reward = EXCLUDED.reward,
          clauses = EXCLUDED.clauses,
          reverted = EXCLUDED.reverted,
          created_at = EXCLUDED.created_at
    `,
    [
      transaction.id,
      block.number,
      transaction.origin,
      transaction.delegator,
      transaction.gas,
      vthoBurn,
      receipt.gasUsed,
      receipt.paid,
      receipt.reward,
      transaction.clauses.length,
      receipt.reverted,
      createdAt,
    ]
  )
  const clauseExplainer = thor.explain()
    .gas(transaction.gas)
    .caller(transaction.origin)
  const explained = await clauseExplainer.execute(transaction.clauses)

  const clauses = transaction.clauses.map((clause, index) => ({
    ...clause,
    explained: explained[index],
  }))

  let insertableClauses = []
  let remainingVthoBurn = vthoBurn
  clauses.forEach((clause, index) => {
    const { transfers, events } = receipt.outputs.length > 0 && receipt.outputs[index] || clause.explained

    const newContract = receipt.outputs.length > 0 && receipt.outputs[index].contractAddress
    const event = events[events.length - 1]
    const signature = clause.data.slice(0, 10)
    const vtho_burn = clause.explained
      ? (clause.explained.gasUsed / receipt.gasUsed) * vthoBurn
      : 0
    remainingVthoBurn -= vtho_burn
    const clauseToInsert = {
      transaction_id: transaction.id,
      vtho_burn,
      created_at: createdAt,
    }
    if (newContract) {
      clauseToInsert.type = 'New Contract'
      clauseToInsert.contract = newContract
    } else if (events.length > 0 && TOKEN_CONTRACTS[event.address] && ABI_SIGNATURES[signature]) {
      const decoded = abi.decodeParameters(
        ABI_SIGNATURES[signature],
        '0x' + clause.data.slice(10)
      )
      clauseToInsert.type = 'Transfer'
      clauseToInsert.transfer_recipient = decoded._to
      clauseToInsert.transfer_sender = transaction.origin
      clauseToInsert.transfer_token = TOKEN_CONTRACTS[event.address].replace(' Token', '')
      clauseToInsert.transfer_amount = Number(
        new bigNumber(decoded._amount).dividedBy(Math.pow(10, 18)).toFixed(2)
      )
      clauseToInsert.contract = event.address
    } else if (transfers.length > 0) {
      const transfer = transfers[transfers.length - 1] // TODO handle multiple transfers in a single clause
      clauseToInsert.type = 'Transfer'
      clauseToInsert.transfer_recipient = transfer.recipient
      clauseToInsert.transfer_sender = transfer.sender
      clauseToInsert.transfer_token = 'VET',
      clauseToInsert.transfer_amount = Number(
        new bigNumber(transfer.amount, 16).dividedBy(Math.pow(10, 18)).toFixed(2)
      )
    } else if (clause.to && clause.data === '0x' && transfers.length === 0) {
      return
    } else {
      clauseToInsert.type = 'Data'
      clauseToInsert.contract = clause.to
      const eventMatchingKnownContract = events.find(event => !!KNOWN_CONTRACTS[event.address])
      if (eventMatchingKnownContract) clauseToInsert.contract = eventMatchingKnownContract.address
    }
    if (receipt && receipt.reverted === true) clauseToInsert.reverted = true
    if (Object.keys(clauseToInsert).length === 1) return
    insertableClauses.push(clauseToInsert)
  })

  const vthoBurnPart = remainingVthoBurn / insertableClauses.length
  insertableClauses = insertableClauses.map(clause => ({
    ...clause,
    vtho_burn: clause.vtho_burn + vthoBurnPart,
  }))

  if (insertableClauses.length > 0) {
    await client.query(`DELETE FROM clauses WHERE transaction_id = $1`, [transaction.id])
    await client.query(`${knex('clauses').insert(insertableClauses)}`)
  }
}
