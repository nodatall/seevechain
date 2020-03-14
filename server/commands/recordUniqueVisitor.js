const moment = require('moment')

module.exports = async function({ client, uid }) {
  await client.query(
    `
      INSERT INTO
        unique_visitors (uid, date)
      VALUES
        ($1, $2)
      ON CONFLICT DO NOTHING
    `,
    [
      uid,
      moment().format('L')
    ]
  )
}
