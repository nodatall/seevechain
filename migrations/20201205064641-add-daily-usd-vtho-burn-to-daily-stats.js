exports.up = db => {
  return db.runSql(
    `
      ALTER TABLE daily_stats
      ADD column vtho_burn_usd decimal;
    `
  )
}

exports.down = db => {
  return db.runSql(
    `
      ALTER TABLE daily_stats
      DROP column vtho_burn_usd;
    `
  )
}
