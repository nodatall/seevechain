function getRetentionHours(env){
  const configured = Number((env || process.env).TRADE_RETENTION_HOURS)
  if (Number.isFinite(configured) && configured > 0) return configured
  return 48
}

async function pruneOldTrades({ client, env }){
  if (!client) throw new Error('client is required')

  const retentionHours = getRetentionHours(env)
  const result = await client.query(
    `
      DELETE FROM trades
      WHERE time_ms < $1
    `,
    [
      Date.now() - (retentionHours * 60 * 60 * 1000),
    ]
  )

  return result
}

module.exports = pruneOldTrades
module.exports.getRetentionHours = getRetentionHours
