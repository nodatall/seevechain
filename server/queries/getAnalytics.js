module.exports = async function(client, limit = 360) {
  const uniqueVisits = await client.many(
    `
      SELECT count(*), date FROM unique_visitors GROUP BY date ORDER BY date DESC LIMIT $1;
    `,
    [limit]
  )

  return {
    uniqueVisits,
  }
}
