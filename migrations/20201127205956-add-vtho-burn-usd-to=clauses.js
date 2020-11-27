exports.up = db => {
  return db.runSql(
    `
      ALTER TABLE clauses
      ADD column vtho_burn_usd decimal;

      ALTER TABLE transactions
      ADD column vtho_burn_usd decimal;

    `
  )
}

exports.down = db => {
  return db.runSql(
    `
      ALTER TABLE clauses
      DROP column vtho_burn_usd;

      ALTER TABLE transactions
      DROP column vtho_burn_usd;
    `
  )
}
