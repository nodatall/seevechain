module.exports = async function({ client, transaction, block, receipt }) {
  const contract = (
    transaction.clauses && transaction.clauses[0] && transaction.clauses[0].to
  ) || 'New Contract'

  const vthoBurn = ((receipt.gasUsed + (receipt.gasUsed * ((transaction.gasPriceCoef || 0) / 255))) / 1000) * .7

  try {
    await client.query(
      `
        INSERT INTO
          transactions (id, block_id, origin, contract, delegator, gas, clauses, vtho_burn, gas_used, paid, reward)
        values
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `,
      [
        transaction.id,
        block.id,
        transaction.origin,
        contract,
        transaction.delegator,
        transaction.gas,
        transaction.clauses.length,
        vthoBurn,
        receipt.gasUsed,
        receipt.paid,
        receipt.reward,
      ]
    )
  } catch(error) {
    console.log(error)
  }

}
