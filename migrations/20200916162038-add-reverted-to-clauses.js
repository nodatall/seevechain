exports.up = db => {
  return db.runSql(
    `
      ALTER TABLE clauses
      ADD column reverted BOOLEAN DEFAULT FALSE;
    `
  )
}

exports.down = db => {
  return db.runSql(
    `
      ALTER TABLE clauses
      DROP column reverted;
    `
  )
}
