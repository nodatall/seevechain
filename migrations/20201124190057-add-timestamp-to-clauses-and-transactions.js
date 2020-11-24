exports.up = db =>
  db.runSql(
    `
      ALTER TABLE clauses
      ADD column created_at timestamp with time zone;

      ALTER TABLE transactions
      ADD column created_at timestamp with time zone;
    `
  )

exports.down = db =>
  db.runSql(
    `
      ALTER TABLE clauses
      DROP column created_at;

      ALTER TABLE transactions
      DROP column created_at;
    `
  )
