const TOKEN_CONTRACTS = {
  '0x0000000000000000000000000000456e65726779': 'VTHO',
  '0x0ce6661b4ba86a0ea7ca2bd86a0de87b0b860f14': 'OCE',
  '0xf8e1faa0367298b55f57ed17f7a2ff3f5f1d1628': 'EHrT',
  '0x89827f7bb951fd8a56f8ef13c5bfee38522f2e1f': 'PLA',
  '0x1b8ec6c2a45cca481da6f243df0d7a5744afc1f8': 'DBET',
  '0xacc280010b2ee0efc770bce34774376656d8ce14': 'HAI',
  '0x46209d5e5a49c1d403f4ee3a0a88c3a27e29e58d': 'JUR',
  '0x5db3c8a942333f6468176a870db36eef120a34dc': 'SHA',
  '0x540768b909782c430cc321192e6c2322f77494ec': 'SNK',
  '0xf9fc8681bec2c9f35d0dd2461d035e62d643659b': 'AQD',
  '0x2182aa52adb1b27903d089e4432538a695effe3d': 'BAG',
  '0xa94a33f776073423e163088a5078feac31373990': 'TIC',
  '0xb69ded9f0da15d240ee6803dacd7fcf68744e8ff': 'VET+',
  '0x5fa7493677c40645326faf241095114fede3a28f': 'STAR',
  '0xae4c53b120cba91a44832f875107cbc8fbee185c': 'YEET',
}

const ABI_SIGNATURES = {
  '0xa9059cbb': [
    {
      name: '_to',
      type: 'address'
    },
    {
      name: '_amount',
      type: 'uint256'
    }
  ]
}

module.exports = {
  TOKEN_CONTRACTS,
  ABI_SIGNATURES,
}
