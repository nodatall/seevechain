exports.up = db => {
  return db.runSql(
    `
      ALTER TABLE blocks
      ALTER COLUMN number TYPE bigint,
      ALTER COLUMN gas_used TYPE bigint;

      ALTER TABLE transactions
      ALTER COLUMN block_number TYPE bigint,
      ALTER COLUMN gas TYPE bigint,
      ALTER COLUMN gas_price_coef TYPE bigint,
      ALTER COLUMN clauses TYPE bigint,
      ALTER COLUMN gas_used TYPE bigint;
    `
  )
}

exports.down = db => {
  return db.runSql(
    `
      ALTER TABLE blocks
      ALTER COLUMN number TYPE integer,
      ALTER COLUMN gas_used TYPE integer;

      ALTER TABLE transactions
      ALTER COLUMN block_number TYPE integer,
      ALTER COLUMN gas TYPE integer,
      ALTER COLUMN gas_price_coef TYPE integer,
      ALTER COLUMN clauses TYPE integer,
      ALTER COLUMN gas_used TYPE integer;
    `
  )
}
