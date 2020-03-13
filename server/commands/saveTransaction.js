module.exports = async function({ client, transaction, block, receipt }) {
  const contract = (
    transaction.clauses && transaction.clauses[0] && transaction.clauses[0].to
  ) || 'New Contract'

  const vthoBurn = ((receipt.gasUsed + (receipt.gasUsed * ((transaction.gasPriceCoef || 0) / 255))) / 1000) * .7

  await client.query(
    `
      INSERT INTO
        transactions (id, block_number, origin, contract, delegator, gas, clauses, vtho_burn, gas_used, paid, reward)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
          reward = EXCLUDED.reward;
    `,
    [
      transaction.id,
      block.number,
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
}
