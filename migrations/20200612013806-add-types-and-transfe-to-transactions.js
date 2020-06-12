exports.up = db => {
  return db.runSql(
    `
      ALTER TABLE transactions
      RENAME COLUMN contract TO contracts;

      ALTER TABLE transactions
      ADD COLUMN types text,
      ADD COLUMN transfers integer;
    `
  )
}

exports.down = db => {
  return db.runSql(
    `
      ALTER TABLE transactions
      RENAME COLUMN contracts TO contract;

      ALTER TABLE transactions
      DROP COLUMN types,
      DROP COLUMN transfers;
    `
  )
}
