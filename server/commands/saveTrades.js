function normalizeRaw(raw){
  if (raw === undefined) return null
  if (typeof raw === 'string') return raw
  return JSON.stringify(raw)
}

function toPublicTrade(trade){
  return {
    coin: trade.coin,
    tid: Number(trade.tid),
    timeMs: Number(trade.time_ms === undefined ? trade.timeMs : trade.time_ms),
    side: trade.side,
    rawSide: trade.raw_side === undefined ? trade.rawSide : trade.raw_side,
    price: String(trade.price),
    size: String(trade.size),
    notional: String(trade.notional),
    hash: trade.hash || null,
  }
}

function buildSaveTradesSql(trades){
  const rows = trades || []
  const columns = [
    'coin',
    'tid',
    'time_ms',
    'side',
    'raw_side',
    'price',
    'size',
    'notional',
    'hash',
    'buyer',
    'seller',
    'raw',
  ]
  const values = []

  if (!rows.length) {
    return {
      sql: '',
      values,
    }
  }

  const placeholders = rows.map((trade, rowIndex) => {
    const offset = rowIndex * columns.length

    values.push(
      trade.coin,
      trade.tid,
      trade.timeMs === undefined ? trade.time_ms : trade.timeMs,
      trade.side,
      trade.rawSide === undefined ? trade.raw_side : trade.rawSide,
      trade.price,
      trade.size,
      trade.notional,
      trade.hash || null,
      trade.buyer || null,
      trade.seller || null,
      normalizeRaw(trade.raw)
    )

    return `(${columns.map((_, columnIndex) => `$${offset + columnIndex + 1}`).join(', ')})`
  })

  return {
    sql: `
      INSERT INTO trades (
        ${columns.join(', ')}
      )
      VALUES
        ${placeholders.join(',\n        ')}
      ON CONFLICT (coin, time_ms, tid) DO NOTHING
      RETURNING
        coin,
        tid,
        time_ms,
        side,
        raw_side,
        price,
        size,
        notional,
        hash
    `,
    values,
  }
}

async function saveTrades({ client, trades }){
  const rows = trades || []
  if (!client) throw new Error('client is required')
  if (!rows.length) return []

  const { sql, values } = buildSaveTradesSql(rows)
  const savedTrades = await client.query(sql, values)

  return savedTrades.map(toPublicTrade)
}

module.exports = saveTrades
module.exports.buildSaveTradesSql = buildSaveTradesSql
module.exports.toPublicTrade = toPublicTrade
