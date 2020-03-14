exports.up = db => {
  return db.runSql(
    `
      CREATE TABLE unique_visitors (
        uid text NOT NULL,
        date text NOT NULL,
        UNIQUE (uid, date)
      );
    `
  )
}

exports.down = db => {
  return db.runSql('DROP TABLE unique_visitors;')
}
