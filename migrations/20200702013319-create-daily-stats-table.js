exports.up = db => {
  return db.runSql(
    `
      CREATE TABLE daily_stats (
        day date NOT NULL UNIQUE,
        vtho_burn integer DEFAULT 0,
        transaction_count integer DEFAULT 0,
        clause_count integer DEFAULT 0
      );
    `
  )
}

exports.down = db => {
  return db.runSql('DROP TABLE daily_stats;')
}
