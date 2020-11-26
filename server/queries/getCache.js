module.exports = async function({ client, cacheName }) {
  const record = await client.oneOrNone(
    `
      SELECT cache
      FROM caches
      WHERE name = $1;
    `,
    [cacheName]
  )

  if (!record) return

  return JSON.parse(record.cache)
}
