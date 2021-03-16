require('../../environment.js')

const pgp = require('pg-promise')

const db = pgp()
db.pg.defaults.ssl = true
const client = db(process.env.DATABASE_URL)
module.exports = client
