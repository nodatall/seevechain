require('../../environment.js')

const pgp = require('pg-promise')

const db = pgp()
const connectionString = process.env.DATABASE_URL
const useSsl = process.env.NODE_ENV === 'production' || /sslmode=require/.test(connectionString)
const clientConfig = { connectionString }

if (useSsl) {
  clientConfig.ssl = {
    rejectUnauthorized: false,
  }
}

const client = db(clientConfig)
module.exports = client
