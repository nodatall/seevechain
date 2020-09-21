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

const KNOWN_CONTRACTS = {
  '0x505b95e128e403634fe6090472485341905fc0f9': `Yunnan Pu'er Tea`,
  '0xba6b65f7a48636b3e533205d9070598b4faf6a0c': 'DNVGL',
  '0xbb763cea82127548c465f6ad83a297f292e5c2fb': 'Reebonz',
  '0xfbc5c4e371164e3f1dc5d1760a98f3d227ba7e3b': 'Reebonz',
  '0x9ee753d070c1fd42d715e951bd8d5441e6c7d052': 'Reebonz',
  '0x1a2f8fc8e821f46d6962bb0a4e06349a3ad4cf33': 'Walmart China',
  '0xbe7a61b0405fdfbaae28c1355cd53c8affc1c4b0': 'Walmart China',
  '0xc89dcd4b36b5182f974c556408681cd035be18e4': 'FoodGates',
  '0xecc159751f9aed21399d5e3ce72bc9d4fccb9ccc': 'MyStory',
  '0x9bcb81a9eadd1457ee9729365f9a77d190670ab2': 'Shanghai Gas',
  '0xf9f99f982f3ea9020f0a0afd4d4679dfee1b63cf': 'vexchange.io',
  '0xf306dfc3c4a276ac4c1795c5896e9f4a967341b6': 'realitems.io',
  '0xa7f8b361060222b3aee75f4b457ba0353cf10998': 'E-HCert',
  '0xa9f3c1bd52c3a506cecbb8cbca562ef26c833175': 'Yuhongtai Foods',
  '0x040093ab307f5acb4ae3afb0fb31de0ec46d62f9': 'safehaven.io',
  '0x1111111111111111111111111111111111111111': 've-name.web.app',
  '0x1Cc13a24b1F73288cc7791C2c8Fd428357405226': 'MyCare',
  '0xcd01241c39d2a503aa4ac083fd2563556af9fe56': 'Vulcan',
  '0x4a2d83a3d5b81566f1318d9e39fce6de5ee23bae': 'Vulcan',
  '0xb1b9d40758cc3d90f1b2899dfb7a64e5d0235c61': 'Vulcan',
  '0x27b508dba99a05c7810d4956d74daa71bac0d969': 'VIMworld',
  '0xb81e9c5f9644dec9e5e3cac86b4461a222072302': 'VeChain Node',
  '0xe28ce32d637eb93cbda105f87fbb829e9ef8540b': 'VeChain Auction',
  '0xdbaec4165a6cff07901c41d3561eefdcfbc20cb6': 'Steering Committee Vote',
  '0x0000000000000000000000417574686f72697479': 'VeChain Authority Node',
  '0x05b866b65f3fbf118d45ca2157c43d888f001dd1': 'VIM Dispenser',
  '0xc96b1e1a436c5ecf150ac7a7de64c0eec73883e0': 'VIM Feeding',
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
  KNOWN_CONTRACTS,
  TOKEN_CONTRACTS,
  ABI_SIGNATURES,
}
