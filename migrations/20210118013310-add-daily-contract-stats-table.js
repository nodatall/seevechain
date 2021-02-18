exports.up = db => {
  return db.runSql(
    `
      CREATE TABLE daily_contract_stats (
        day date NOT NULL UNIQUE,
        contract text NOT NULL,
        vtho_burn integer DEFAULT 0,
        vtho_burn_usd decimal,
        clause_count integer DEFAULT 0
      );
    `
  )
}

exports.down = db => {
  return db.runSql('DROP TABLE daily_contract_stats;')
}
