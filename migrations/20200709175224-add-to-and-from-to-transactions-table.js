exports.up = db => {
  return db.runSql(
    `
      ALTER TABLE transactions
      ADD column transfer_to TEXT,
      ADD column transfer_from TEXT;
    `
  )
}

exports.down = db => {
  return db.runSql(
    `
      ALTER TABLE transactions
      DROP column transfer_to,
      DROP column transfer_from;
    `
  )
}
