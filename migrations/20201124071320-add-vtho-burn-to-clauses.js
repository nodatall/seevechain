exports.up = db => {
  return db.runSql(
    `
      ALTER TABLE clauses
      ADD column vtho_burn decimal;

    `
  )
}

exports.down = db => {
  return db.runSql(
    `
      ALTER TABLE clauses
      DROP column vtho_burn;
    `
  )
}
