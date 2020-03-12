require('../../environment.js')

const pgp = require('pg-promise')

const db = pgp()
const client = db(process.env.DATABASE_URL)
module.exports = client
