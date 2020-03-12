exports.up = db => {
  return db.runSql(
    `
      CREATE TABLE blocks (
        id text UNIQUE,
        number integer NOT NULL UNIQUE,
        parent_id text NOT NULL,
        timestamp timestamp with time zone NOT NULL,
        gas_used integer NOT NULL,
        signer text NOT NULL,
        number_of_transactions integer
      );

      CREATE TABLE transactions (
        id text UNIQUE,
        block_id text REFERENCES blocks(id) ON DELETE CASCADE,
        contract text,
        origin text,
        delegator text,
        gas integer,
        gas_price_coef integer,
        clauses integer,
        vtho_burn decimal,
        gas_used integer,
        paid text,
        reward text
      );
    `
  )
}

exports.down = db => {
  return db.runSql('DROP TABLE blocks; DROP TABLE transactions;')
}
