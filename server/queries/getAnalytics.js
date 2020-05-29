module.exports = async function(client, limit = 30) {
  const uniqueVisits = await client.many(
    `
      SELECT count(*), date FROM unique_visitors GROUP BY date ORDER BY date LIMIT $1;
    `,
    [limit]
  )

  return {
    uniqueVisits,
  }
}
