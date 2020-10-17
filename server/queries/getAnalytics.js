module.exports = async function(client, limit = 360) {
  const uniqueVisits = await client.many(
    `
      SELECT count(*), date
      FROM unique_visitors
      WHERE timestamp > '2020-05-26'
      GROUP BY date
      ORDER BY date DESC
      LIMIT $1;
    `,
    [limit]
  )

  return {
    uniqueVisits,
  }
}
