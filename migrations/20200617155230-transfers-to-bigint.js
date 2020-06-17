exports.up = db => {
  return db.runSql(
    `
      ALTER TABLE transactions
      ALTER COLUMN transfers TYPE bigint;
    `
  )
}

exports.down = db => {
  return db.runSql(
    `
      ALTER TABLE transactions
      ALTER COLUMN transfers TYPE integer;
    `
  )
}
