require('../../environment.js')

const pgp = require('pg-promise')

const db = pgp()
const client = db({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,
  },
})
module.exports = client
