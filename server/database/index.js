require('../../environment.js')

const pgp = require('pg-promise')

const db = pgp()
const client = db({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})
module.exports = client
