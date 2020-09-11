exports.up = db => {
  return db.runSql(
    `
      CREATE TABLE clauses (
        transaction_id text NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
        type text NOT NULL,
        transfer_recipient text,
        transfer_sender text,
        transfer_token text,
        transfer_amount real,
        contract text
      );

      ALTER TABLE transactions
        DROP column types,
        DROP column contracts,
        DROP column transfers,
        DROP column transfer_to,
        DROP column transfer_from,
        ADD COLUMN reverted boolean DEFAULT false;
    `
  )
}

exports.down = () => {
  throw new Error('no going back')
}
