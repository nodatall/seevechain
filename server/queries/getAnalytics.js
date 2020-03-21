module.exports = async function(client) {
  const uniqueVisits = await client.many(
    `
      SELECT count(*), date FROM unique_visitors GROUP BY date ORDER BY date;
    `
  )

  return {
    uniqueVisits,
  }
}
