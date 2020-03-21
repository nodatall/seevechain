exports.up = db => {
  return db.runSql(
    `
      DELETE FROM unique_visitors;

      ALTER TABLE unique_visitors
      ADD COLUMN timestamp timestamp with time zone DEFAULT NOW();
    `
  )
}

exports.down = db => {
  return db.runSql(
    `
      ALTER TABLE unique_visitors
      DROP COLUMN timestamp;
    `
  )
}
