exports.up = async db => {
  await db.runSql(
    `
      UPDATE clauses
      SET contract = $1
      WHERE transfer_token = 'VTHO';
    `,
    ['0x0000000000000000000000000000456e65726779']
  )

  await db.runSql(
    `
      UPDATE clauses
      SET contract = $1
      WHERE transfer_token = 'OCE';
    `,
    ['0x0ce6661b4ba86a0ea7ca2bd86a0de87b0b860f14']
  )

  await db.runSql(
    `
      UPDATE clauses
      SET contract = $1
      WHERE transfer_token = 'EHrT';
    `,
    ['0xf8e1faa0367298b55f57ed17f7a2ff3f5f1d1628']
  )

  await db.runSql(
    `
      UPDATE clauses
      SET contract = $1
      WHERE transfer_token = 'PLA';
    `,
    ['0x89827f7bb951fd8a56f8ef13c5bfee38522f2e1f']
  )

  await db.runSql(
    `
      UPDATE clauses
      SET contract = $1
      WHERE transfer_token = 'DBET';
    `,
    ['0x1b8ec6c2a45cca481da6f243df0d7a5744afc1f8']
  )

  await db.runSql(
    `
      UPDATE clauses
      SET contract = $1
      WHERE transfer_token = 'HAI';
    `,
    ['0xacc280010b2ee0efc770bce34774376656d8ce14']
  )

  await db.runSql(
    `
      UPDATE clauses
      SET contract = $1
      WHERE transfer_token = 'JUR';
    `,
    ['0x46209d5e5a49c1d403f4ee3a0a88c3a27e29e58d']
  )

  await db.runSql(
    `
      UPDATE clauses
      SET contract = $1
      WHERE transfer_token = 'SHA';
    `,
    ['0x5db3c8a942333f6468176a870db36eef120a34dc']
  )
}

exports.down = () => {
  throw new Error('cannot go back')
}
