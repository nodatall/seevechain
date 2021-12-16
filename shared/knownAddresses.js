const KNOWN_CONTRACTS = {
  '0x505b95e128e403634fe6090472485341905fc0f9': `Yunnan Pu'er Tea`,
  '0xba6b65f7a48636b3e533205d9070598b4faf6a0c': 'DNV',
  '0xbb763cea82127548c465f6ad83a297f292e5c2fb': 'Reebonz',
  '0xfbc5c4e371164e3f1dc5d1760a98f3d227ba7e3b': {
    short: 'Reebonz',
    long: 'Reebonz 2',
  },
  '0x9ee753d070c1fd42d715e951bd8d5441e6c7d052': {
    short: 'Reebonz',
    long: 'Reebonz 3',
  },
  '0xbe7a61b0405fdfbaae28c1355cd53c8affc1c4b0': 'Walmart China',
  '0x1a2f8fc8e821f46d6962bb0a4e06349a3ad4cf33': {
    short: 'Walmart China',
    long: 'Walmart China 2',
  },
  '0xc89dcd4b36b5182f974c556408681cd035be18e4': 'FoodGates',
  '0xecc159751f9aed21399d5e3ce72bc9d4fccb9ccc': 'MyStory',
  '0xbdccecf078f27cc9bf7a18b4cc2c25068a616fb4': 'Shanghai Gas',
  '0x9bcb81a9eadd1457ee9729365f9a77d190670ab2': {
    short: 'Shanghai Gas',
    long: 'Shanghai Gas 2',
  },
  '0xf9f99f982f3ea9020f0a0afd4d4679dfee1b63cf': {
    short: 'vexchange.io',
    long: 'vexchange.io VTHO',
  },
  '0xdc391a5dbb89a3f768c41cfa0e85dcaaf3a91f91': {
    short: 'vexchange.io',
    long: 'vexchange.io OCE',
  },
  '0xdc690f1a5de6108239d2d91cfdaa1d19e7ef7f82': {
    short: 'vexchange.io',
    long: 'vexchange.io YEET',
  },
  '0x6d08d19dff533050f93eaaa0a009e2771d3598bc': {
    short: 'vexchange.io',
    long: 'vexchange.io EHrT',
  },
  '0xf306dfc3c4a276ac4c1795c5896e9f4a967341b6': 'realitems.io',
  '0xbc90a27cef38c774717bf1dfd13ff9a906920215': {
    short: 'realitems.io',
    long: 'realitems.io 2',
  },
  '0xa7f8b361060222b3aee75f4b457ba0353cf10998': 'E-HCert',
  '0xa9f3c1bd52c3a506cecbb8cbca562ef26c833175': 'Yuhongtai Foods',
  '0x040093ab307f5acb4ae3afb0fb31de0ec46d62f9': 'safehaven.io',
  '0x7196c6b28f5edac5d9134e44051635cc572fe07b': {
    short: 'safehaven.io',
    long: 'Safehaven Inheriti ',
  },
  '0x1111111111111111111111111111111111111111': 've-name.web.app',
  '0x1Cc13a24b1F73288cc7791C2c8Fd428357405226': 'MyCare',
  '0xffa34bf5b1d7178bd9a9815c84bc64570d88560c': {
    short: 'Vulcan',
    long: 'Vulcan 2',
  },
  '0xdab45be2d501549d11b5712f4c804d793fae5d0b': {
    short: 'Vulcan',
    long: 'Vulcan 3',
  },
  '0x81d5973a21c2dacf9e2a4abcce807338036a3954': {
    short: 'Vulcan',
    long: 'Vulcan 4',
  },
  '0xb1b9d40758cc3d90f1b2899dfb7a64e5d0235c61': 'Vulcan',
  '0xb81e9c5f9644dec9e5e3cac86b4461a222072302': 'VeChain Node',
  '0xe28ce32d637eb93cbda105f87fbb829e9ef8540b': 'VeChain Auction',
  '0xdbaec4165a6cff07901c41d3561eefdcfbc20cb6': 'Steering Committee Vote',
  '0x0000000000000000000000417574686f72697479': 'VeChain Authority Node',
  '0x27b508dba99a05c7810d4956d74daa71bac0d969': {
    short: 'VIMworld',
    long: 'VIM Transfer',
  },
  '0x05b866b65f3fbf118d45ca2157c43d888f001dd1': {
    short: 'VIMworld',
    long: 'VIM Dispenser',
  },
  '0x9792bc3fe1d998af4f756d3db7fa017b05024ea9': {
    short: 'VIMworld',
    long: 'VIM Dispenser 2',
  },
  '0xc6cd73941365c0e22d0eeaa8944aa9d0efe554d6': {
    short: 'VIMworld',
    long: 'VIM Feeding',
  },
  '0x46a7567f65c278b119ddeabf440f42ba2de949c0': {
    short: 'VIMworld',
    long: 'VIM Minting',
  },
  '0x36ead69626aecfa792b1cb8a546d3c1b37ac8ee5': {
    short: 'VIMworld',
    long: 'VIM Market',
  },
  '0x65f7ac9ece8ed59044768d53c0d44e3cb7f6ceff': 'Ubique',
  '0x4fe1ac0b38339a59682fea4ef970404cf989b09c': 'Indigiledger',
  '0xe1fc8ecc13dc25db25fa4e7c756acbc87f965e60': {
    short: 'FoodGates',
    long: 'FoodGates 3',
  },
  '0x2dd241b93e435046d7264357d67eb58a9cea5857': {
    short: 'FoodGates',
    long: 'FoodGates 2',
  },
  '0x535ab4a9fce43dc71e9540534733bbeb0f494d5c': 'burntoken.io',
  '0x1a048cff120f3ebff9bb66459effa34445c8e87e': 'KnowSeafood',
  '0x5e8078d59ed05b439508827569e47f9585c992d2': 'Madini Africa',
  '0xfee823ac958e34973d124218f8ddbe65a651a08b': {
    short: 'NSF Intl.',
    long: 'NSF International',
  },
  '0x66f36d228a5201419dff9895dcfb8bf45c3cf262': {
    short: 'San Marino Green Pass',
    long: 'San Marino Green Pass NFT',
  },
  '0xdcaa96e264eb8514b130e1a97072b41c875bec7b': {
    short: 'San Marino Green Pass',
    long: 'San Marino Green Pass Data Upload',
  },
  '0xe92fddd633008c1bca6e738725d2190cd46df4a1': {
    short: 'VPunks',
    long: 'VPunks VIP-181',
  },
  '0x31c71f4cd01fddd940a46dafd72d3291f52040a4': {
    short: 'VPunks',
    long: 'VPunks NFT Auction',
  },
  '0x5a45edc6311017e6b12ebfb32c28a8d36ecf7686': 'Avery Dennison',
  '0xd948e6cf79ab34b716350db4aee33cf0031cf7a1': 'XGG Black Tea',
  '0x3805c62f463f34b2f913bb09115aaa9460794d7c': 'WOV Clock Auction Genesis',
  '0x04edc606b0d60e843528422619c6d939be8a2fcf': 'NFT Paper Project',
  '0x148442103eeadfaf8cffd593db80dcdeadda71c9': {
    short: 'VeSeaNFT',
    long: 'VeSeaNFT VeKings',
   },
  '0x0809d6df5d8325bba4783ec4ba67d8c3ab817e99': {
    short: 'VeSeaNFT',
    long: 'VeSeaNFT VeGhosts',
   },
  'tbd': {
    short: 'VeSeaNFT',
    long: 'VeSeaNFT Honorary VeKings',
   },
  '0x0809d6df5d8325bba4783ec4ba67d8c3ab817e99': {
    short: 'VeSeaNFT',
    long: 'VeSeaNFT Veysarum',
   },
  '0x9932690b32c4c0cd4d86a53eca948d33b1556ae7': {
    short: 'VeSeaNFT',
    long: 'VeSeaNFT VeKongs',
   },
  '0xc35d04f8783f85ede2f329eed3c1e8b036223a06': {
    short: 'VeSeaNFT',
    long: 'VeSeaNFT Galaxy Portraits',
   },
  '0x46db08ca72b205a8f9e746a9e33a30d2f379216b': {
    short: 'VeSeaNFT',
    long: 'VeSeaNFT Vumanoids',
   },
  '0x8b55d319b6cae4b9fd0b4517f29cf4a100818e38': {
    short: 'VeSeaNFT',
    long: 'VeSeaNFT Undead VeKings',
   },
  '0x8b55d319b6cae4b9fd0b4517f29cf4a100818e38': {
    short: 'VeSeaNFT',
    long: 'VeSeaNFT Sacrificed VeKings',
   },
  '0xffcc1c4492c3b49825712e9a8909e4fcebfe6c02': {
    short: 'VeSeaNFT',
    long: 'VeSeaNFT Mad v-Apes',
   },
  '0x60deca6baceb6258c8d718f9987acb17176f7f24': {
    short: 'VeSeaNFT',
    long: 'VeSeaNFT universe',
   },
  '0x436f0a9b45e85eb2f749aa67d3393c649ef4dff2': {
    short: 'VeSeaNFT',
    long: 'VeSeaNFT AstroVETs',
   },
  '0x01c10830feef88258e7a1ca998009ac19f7f087e': {
    short: 'VeSeaNFT',
    long: 'VeSeaNFT VeSkullz',
   },
  '0x6aa982158617d53c37f65d43eb9a156449adfff3': {
    short: 'VeSeaNFT',
    long: 'VeSeaNFT Warbands',
   },
  '0x14c7d5357da8a8ed7a3983bc5ffd249fee63192d': {
    short: 'VeSeaNFT',
    long: 'VeSeaNFT VeNerds',
   },
  '0x88d7e38af5bdb6e65a045c79c9ce70ed06e6569b': {
    short: 'VeSeaNFT',
    long: 'VeSeaNFT New Pigs Order',
   },
  '0x1f173256c08e557d0791bc6ef2ac1b1099f57ed5': {
    short: 'VeSeaNFT',
    long: 'VeSeaNFT veLoot',
   },
  '0x4FEd8A1c42098cc8E21d624baE8Ccad9F3dCBAeC': {
    short: 'VeSeaNFT',
    long: 'VeSeaNFT Victs',
   },
  '0x0809d6df5d8325bba4783ec4ba67d8c3ab817e99': {
    short: 'VeSeaMarket',
    long: 'VeSeaMarket VeKings',
   },
  '0x8db8b6a5985b3fba2f2e93fc5f29194cccb48ef9': {
    short: 'VeSeaMarket',
    long: 'VeSeaMarket VeKings v2',
   },
  '0x65b2fa1a0633fbb07e51aec325e2b8d85bbb0a3a': {
    short: 'VeSeaMarket',
    long: 'VeSeaMarket Honorary VeKings',
   },
  '0x948f629cd19bee09ede8475f028963848e504bb6': {
    short: 'VeSeaMarket',
    long: 'VeSeaMarket Veysarum',
   },
  '0x230a07439018c8fb691981727eaac9e10ae3dcdb': {
    short: 'VeSeaMarket',
    long: 'VeSeaMarket VeKongs',
   },
  '0x720ef33b0518614579025cc38297fecfd2dde92d': {
    short: 'VeSeaMarket',
    long: 'VeSeaMarket Galaxy Portraits',
   },
  '0xafb79de90b5711f61f6aba74bb5096f5a782e762': {
    short: 'VeSeaMarket',
    long: 'VeSeaMarket Vumanoids',
   },
  '0x643f03dd99f09db83c984eac548ec8bda97518d5': {
    short: 'VeSeaMarket',
    long: 'VeSeaMarket Undead VeKings',
   },
  '0x2ebaf17d7962f7e91d9819e6db96100ef4d28244': {
    short: 'VeSeaMarket',
    long: 'VeSeaMarket Sacrificed VeKings',
   },
  '0xbbfa98002adf880742c507b2d8cc8d70506310ff': {
    short: 'VeSeaMarket',
    long: 'VeSeaMarket Mad v-Apes',
   },
  '0x7437253c66cad34fd5f9d1863113f158f934ea44': {
    short: 'VeSeaMarket',
    long: 'VeSeaMarket universe',
   },
  '0x6f49ca0319fc902ed60e3f1f1b57b8e835a46fc1': {
    short: 'VeSeaMarket',
    long: 'VeSeaMarket AstroVETs',
   },
  '0x25d68cdc50141921b82745b499f450f40534924f': {
    short: 'VeSeaMarket',
    long: 'VeSeaMarket VeSkullz',
   },
  '0xd512751bdd7884192f7bca54a8e8b08b639fbd66': {
    short: 'VeSeaMarket',
    long: 'VeSeaMarket Warbands',
   },
  '0x062a557ff0d5d17e6fbb5fae1a186bc1ef3c4169': {
    short: 'VeSeaMarket',
    long: 'VeSeaMarket VeNerds',
   }, 
  '0x064ff744912ad88896d84b5c11de9ee3a3b00ef9': {
    short: 'VeSeaMarket',
    long: 'VeSeaMarket New Pigs Order',
   },
  '0x05bd0f2fdd941c3ac3bd3def66506171f591c1da': {
    short: 'VeSeaMarket',
    long: 'VeSeaMarket veLoot',
   },
    '0x2AbcEe824F791CafBfE6b10AbABC8eB48E4Fc1EC': {
    short: 'VeSeaMarket',
    long: 'VeSeaMarket Victs',
   },
}

const TOKEN_CONTRACTS = {
  '0x0000000000000000000000000000456e65726779': 'VTHO Token',
  '0x0ce6661b4ba86a0ea7ca2bd86a0de87b0b860f14': 'OCE Token',
  '0xf8e1faa0367298b55f57ed17f7a2ff3f5f1d1628': 'EHrT Token',
  '0x89827f7bb951fd8a56f8ef13c5bfee38522f2e1f': 'PLA Token',
  '0x1b8ec6c2a45cca481da6f243df0d7a5744afc1f8': 'DBET Token',
  '0xacc280010b2ee0efc770bce34774376656d8ce14': 'HAI Token',
  '0x46209d5e5a49c1d403f4ee3a0a88c3a27e29e58d': 'JUR Token',
  '0x5db3c8a942333f6468176a870db36eef120a34dc': 'SHA Token',
  '0x540768b909782c430cc321192e6c2322f77494ec': 'SNK Token',
  '0xf9fc8681bec2c9f35d0dd2461d035e62d643659b': 'AQD Token',
  '0x2182aa52adb1b27903d089e4432538a695effe3d': 'BAG Token',
  '0xa94a33f776073423e163088a5078feac31373990': 'TIC Token',
  '0xb69ded9f0da15d240ee6803dacd7fcf68744e8ff': 'VET+ Token',
  '0x5fa7493677c40645326faf241095114fede3a28f': 'STAR Token',
  '0xae4c53b120cba91a44832f875107cbc8fbee185c': 'YEET Token',
  '0x1b44a9718e12031530604137f854160759677192': 'MDN Token',
  '0x67fd63f6068962937ec81ab3ae3bf9871e524fc9': 'VEED Token',
  '0xb0821559723db89e0bd14fee81e13a3aae007e65': 'VPU Token',
  '0x170f4ba8e7acf6510f55db26047c83d13498af8a': 'WOV Token',
  '0x0bd802635eb9ceb3fcbe60470d2857b86841aab6': 'VEX Token',
  '0x28c61940bdcf5a67158d00657e8c3989e112eb38': 'GEMS Token',
  '0x99763494a7b545f983ee9fe02a3b5441c7ef1396': 'MVG Token',
}

const KNOWN_ADDRESSES = {
  '0xa4adafaef9ec07bc4dc6de146934c7119341ee25': 'Binance',
  '0xd0d9cd5aa98efcaeee2e065ddb8538fa977bc8eb': 'Binance Cold',
  '0x1263c741069eda8056534661256079d485e111eb': 'Binance Warm',
  '0xd7dd13a54755cb68859eec0cac24144aafb8c881': 'Huobi',
  '0xfe64e37dfc7d64743d9351260fa99073c840452b': 'Binance US',
  '0xb73554767983dc5aaeac2b948e407f57e8e9dea1': 'Bittrex',
  '0xcaca08a5053604bb9e9715ed78102dbb392f21ee': 'Bittrex Cold',
  '0xe13322e57366a4dff3a3a32b33355ff2bd2c4dbd': 'Bitvavo',
  '0x6c61974835b4b8fcde83f74e7e5abc470662b3bc': 'Bitvavo Cold',
  '0xfa4b22b75ae0900e88b640175ae0cd1896ec251a': 'HitBTC',
  '0x48728dcafa1afaeb79c6d7249b6b4a3868ce5c12': 'OceanEx',
  '0x15bccf377f1a9bbd0cd8e24d031c9451326f29a0': 'OceanEx',
  '0xd96ae915d6e28640c373640fd57fad8022c53965': 'OceanEx Custodian',
  '0x8e9e08eed34cf829158fab863f99c0225d31e123': 'OceanEx',
  '0x8979cdda17e1afd32c73b65145484abe03f46725': 'OceanEx',
  '0xdd8a9cca3876343f666a81833d2f3a3863a11159': 'OceanEx',
  '0x254afc2490d83b1a56fe621cd708f89456472d87': 'OceanEx',
  '0x9d30a969297cb008e2d777135155e89a35b5dff4': 'OceanEx',
  '0x589f83e66272d3d783c06dd6a66cb3b3549e5453': 'OceanEx',
  '0x0ce0000000000000000000000000000000000000': 'OceanEx OCE Burn',
  '0x45685fb104772e9b6421202ed2d7309d7a6dc32d': 'OceanEx',
  '0x4e28e3f74c5974c8d18611d5323ae8a1344c3e73': 'OceanEx',
  '0xe6f432d44de32f22a0b6c743e448e4421653393e': 'OceanEx',
  '0xee12ecae8a1fea9d4279640bb87072c9db76198d': 'OceanEx',
  '0x9037aa63d3860b708a31df9d372709322d6a2911': 'KuCoin',
  '0xda4d4530d856623dc820427f71e9aa601075f02d': 'KuCoin',
  '0x832fbebb667acc410b434ecfebcbb841cb7c864c': 'Upbit Cold',
  '0xea09214d6509aa4681ba469dbccfbc89c525c5b7': 'Upbit',
  '0x4703582c50fcd1b65fab573bd02c1c53bbe05f92': 'Crypto.com',
  '0x511513c6e60c347402b57f3b13c3a8e994188cab': 'Crypto.com Cold',
  '0x1c4b70a3968436b9a0a9cf5205c787eb81bb558c': 'Gate.io Cold',
  '0x0f53ec6bbd2b6712c07d8880e5c8f08753d0d5d5': 'BigONE',
  '0x0365289be54c921798533cbe56934e0442bafccf': 'Bithumb',
  '0x86158838e088da2a80a541fe0ec96ea4800bbc5e': 'Bithumb',
  '0x003bfdd8117f9388f82a1101a2c6f4745803c350': 'Bithumb Cold',
  '0x3bd4fd485301490e2482e501522a7f6bd8f16ea5': 'Bithumb Cold',
  '0xe401984ab34bae9f6c9128e50b57e7988ba815c7': 'Bitfinex',
  '0x01d1aec89781056ae69ee7381e8e237b5c0b6a64': 'Bitrue',
  '0x284b9e222c461e32c2fa17053e2ea207041cffa0': 'OceanEx',
  '0x0d0707963952f2fba59dd06f2b425ace40b492fe': 'Gate.io',
  '0x9a107a75cff525b033a3e53cadafe3d193b570ec': 'MXC',
  '0xfa02e5f286f635df9378395f4be54647e73a66a0': 'Lbank',
  '0xfe3baf051e7957393d4bedd14447851946163a74': 'CoinEx',
  '0xfbc6013ee8891ddc86d850fb8bac99b4d14c8405': 'Coinsuper',
  '0xce6b1252b32a34fc4013f096cdf90643fb5d23ba': 'ChangeNOW',
  '0x2c0971b1dccf819f38dcf2d3b55d7219f2b817d0': 'BitMax',
  '0x68e29026cf3a6b6e3fce24e9fcc2865f39c884d7': 'LaToken',
  '0x21d54bcf0142c5a3286a7ec7449ad9c4fd5a68f2': 'RightBTC PLA',
  '0x6852b4161b8bc237db1810700a22bccae370778c': 'Foundation',
  '0x137053dfbe6c0a43f915ad2efefefdcc2708e975': 'Foundation',
  '0x29eca91ce3f715c9ba9e87ec1395dca7d1ce9e9e': 'Investor',
  '0x94bef24751937163e026c63f6c8d833e60c8bf8c': 'Safe Haven ICO',
  '0xd021980f6bdd2e62ec1a15d3e606e9106dec9544': '8Hours ICO',
  '0xa6386e9d2518773f45a941b856b33976ed71c671': '8Hours ICO',
  '0xbd916eddd1fc8a9e496ba6bae4355f09bcc44961': 'VTHO rewards',
  '0xd07c2ee31e98d71aca35aeb29e8a1062fc084cfc': 'HackenAI',
  '0x1466e8f38b89086ea0155216ab51dd3d1e8f571a': 'HackenAI',
  '0x15837e1f91860d5ffdd5f3b93b8c946340111cbe': 'HackenAI',
  '0x1421cb00f42b838e90234b28d05fd701fe1c71dd': 'HackenAI Swap',
  '0xf050cc342f573155917bb0839c5d823ec2703746': 'HackenAI Staking',
  '0x5d7fe18beff1c4f16115cb8cfcd87442a89d9278': 'JUR Reserve',
  '0xf346f1ab880d5b2cd0333bf69c280a732fa4a1c4': 'JUR Team',
  '0xc01b26cd4b9525ad1b67a54fad53a8bff91ae01d': 'JUR',
  '0x17b6254c7324438b469a01ce80b67dd7c4d5eef8': 'Plair ICO',
  '0x48e8dace6a1976d4912f8b5dcc3f45651c3d4b73': 'Safe Haven Boost',
  '0x27942b0d71919c4aa81b7ae6ba951150faef5ae6': 'VIP-191 Sponsor',
}

function getKnownContract(address, shortOrLong) {
  if (!KNOWN_CONTRACTS[address]) return
  return typeof KNOWN_CONTRACTS[address] === 'string'
    ? KNOWN_CONTRACTS[address]
    : KNOWN_CONTRACTS[address][shortOrLong]
}

function getShortKnownContract(address) {
  return getKnownContract(address, 'short')
}

function getLongKnownContract(address) {
  return getKnownContract(address, 'long')
}

const PRETTY_KNOWN_CONTRACTS = {}
for (let key in KNOWN_CONTRACTS) {
  const cur = KNOWN_CONTRACTS[key]
  PRETTY_KNOWN_CONTRACTS[key] = typeof cur === 'string'
    ? cur
    : cur.long
}

module.exports = {
  getShortKnownContract,
  getLongKnownContract,
  KNOWN_CONTRACTS,
  KNOWN_ADDRESSES,
  TOKEN_CONTRACTS,
  PRETTY_KNOWN_CONTRACTS,
}
