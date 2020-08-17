exports.up = db =>
  db.runSql(
    `
      CREATE INDEX idx_block_number ON blocks(number);
      CREATE INDEX idx_transactions_block_number ON transactions(block_number);
    `
  )

exports.down = () =>
  db.runSql(
    `
      DROP INDEX idx_block_number;
      DROP INDEX idx_transactions_block_number;
    `
  )
