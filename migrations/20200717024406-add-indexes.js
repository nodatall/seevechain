exports.up = db =>
  db.runSql(
    `
      CREATE INDEX idx_transactions_id ON transactions(id);
      CREATE INDEX idx_transactions_vtho_burn ON transactions(vtho_burn);
      CREATE INDEX idx_clauses_transaction_id ON clauses(transaction_id);
      CREATE INDEX idx_clauses_contract ON clauses(contract);
      CREATE INDEX idx_unique_visitors_date ON unique_visitors(date);
    `
  )

exports.down = () =>
  db.runSql(
    `
      DROP INDEX idx_transactions_id;
      DROP INDEX idx_transactions_vtho_burn;
      DROP INDEX idx_clauses_transaction_id;
      DROP INDEX idx_clauses_contract;
      DROP INDEX idx_unique_visitors_date;
    `
  )
