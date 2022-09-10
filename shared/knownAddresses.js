const KNOWN_CONTRACTS = {
  '0x505b95e128e403634fe6090472485341905fc0f9': 'Yunnan Pu`er Tea',
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
  '0x576da7124c7bb65a692d95848276367e5a844d95': {
    short: 'VeRocket',
    long: 'Router02',
  },
  '0xbdc2edaea65b51053ffce8bc0721753c7895e12f': {
    short: 'VeRocket',
    long: 'VeRocket Factory',
  },
  '0x29a996b0ebb7a77023d091c9f2ca34646bea6ede': {
    short: 'VeRocket',
    long: 'VeRocket vVET/VTHO',
  },
  '0x58108ba70902869f42eb12c5fdbc0cefab0ad13d': {
    short: 'VeRocket',
    long: 'VeRocket Router',
  },
  '0x7A3d485cC586d2c5543b0DF3B93043CFA8Aec6D6': {
    short: 'VeRocket',
    long: 'Zumoswap VeUSD',
  },
  '0x1a8abd6d5627eb26ad71c0c7ae5224cdc640faf3': {
    short: 'VeRocket',
    long: 'VeRocket vVET/SHA',
  },
  '0xfe778e3491ae917e76e85ba8d30426ee1cccba06': {
    short: 'VeRocket',
    long: 'VeRocket vVET/MVG',
  },
  '0xc8c0b13f1152dbd825ecf67c245291aee215a109': {
    short: 'VeRocket',
    long: 'VeRocket vVET/VEX',
  },
  '0x10ba14b7afec1f3ab701be127ab436de21cdd055': {
    short: 'VeRocket',
    long: 'VeRocket vVET/VPU',
  },
  '0x94355b3079a38a265e6b7a825ab6a06495c2d419': {
    short: 'VeRocket',
    long: 'VeRocket vVET/WOV',
  },
  '0x629965c25e1c5d57fb268b23a79c76520bca6698': {
    short: 'VeRocket',
    long: 'VeRocket vVET/JUR',
  },
  '0x6b7e1aeff308d56f9a8ba1e57174ef97e6cde06d': {
    short: 'VeRocket',
    long: 'VeRocket vVET/VSEA',
  },
  '0x8f34a3764750feb71264e9a105cf07fc301d70d1': {
    short: 'VeRocket',
    long: 'VeRocket vVET/HAI',
  },
  '0x72189e536dcb19bc6e1b4918a07b60ef8aca41d8': {
    short: 'VeRocket',
    long: 'VeRocket vVET/VEED',
  },
  '0xc75668ce138dd65f4de37d986a84ebdef71cda02': {
    short: 'VeRocket',
    long: 'VeRocket vVET/OCE',
  },
  '0x538f8890a383c44e59df4c7263d96ca8048da2c7': {
    short: 'Vexchange',
    long: 'Vexchange (VEX/VET)',
  },
  '0xf9f99f982f3ea9020f0a0afd4d4679dfee1b63cf': {
    short: 'Vexchange',
    long: 'Vexchange (VTHO/VET)',
  },
  '0xdc391a5dbb89a3f768c41cfa0e85dcaaf3a91f91': {
    short: 'Vexchange',
    long: 'Vexchange (OCE/VET)',
  },
  '0xdc690f1a5de6108239d2d91cfdaa1d19e7ef7f82': {
    short: 'Vexchange',
    long: 'Vexchange (YEET/VET)',
  },
  '0x6d08d19dff533050f93eaaa0a009e2771d3598bc': {
    short: 'Vexchange',
    long: 'Vexchange (EHrT/VET)',
  },
  '0x6c0a6e1d922e0e63901301573370b932ae20dadb': {
    short: 'Vexchange',
    long: 'Vexchange (Router)',
  },
  '0xd86bed355d9d6a4c951e96755dd0c3cf004d6cd0': {
    short: 'Vexchange',
    long: 'Vexchange (WOV/VET)',
  },
  '0xf306dfc3c4a276ac4c1795c5896e9f4a967341b6': 'realitems.io',
  '0xbc90a27cef38c774717bf1dfd13ff9a906920215': {
    short: 'realitems.io',
    long: 'realitems.io 2',
  },
  '0xe860cef926e5e76e0e88fdc762417a582f849c27': {
    short: 'XP Network',
    long: 'XPN - Bridge',
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
  '0xb3e9ab43306695dd7ab5a1c8a68db877206da298': {
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
  '0xc7fd71b05b3060fce96e4b6cdc6ec353fa6f838e':{
    short: 'WorldOfV',
    long: 'v1 - Marketplace Community NFT',
  },
  '0xc3f851f9f78c92573620582bf9002f0c4a114b67': {
    short: 'WorldOfV',
    long: 'v2 - Marketplace Community NFT',
  },
  '0xe01cb06168f52b40fc60d5ce218346361a75efe7': {
    short: 'WorldOfV',
    long: 'Auction Marketplace',
  },
  '0xe56861c0bb8012ec955da4e4122895ed2a46d229': {
    short: 'WorldOfV',
    long: 'Offer Marketplace',
  },
  '0x5e6265680087520dc022d75f4c45f9ccd712ba97': {
    short: 'WorldOfV',
    long: 'Open Mint Community NFT',
  },
  '0xc7592f90a6746e5d55e4a1543b6cae6d5b11d258': {
    short: 'WorldOfV',
    long: 'Account Registry Contract',
  },
  '0x93ae8aab337e58a6978e166f8132f59652ca6c56': {
    short: 'WorldOfV',
    long: 'Genesis WoV Collection',
  },
  '0x9aab6e4e017964ec7c0f092d431c314f0caf6b4b': {
    short: 'WorldOfV',
    long: 'Special WoV Collection',
  },
  '0x2a7bc6e39bcf51f5c55e7fc779e6b4da30be30c3': {
    short: 'WorldOfV',
    long: 'VeHashes WoV Collection',
  },
  '0x73f32592df5c0da73d56f34669d4ae28ae1afd9e': {
    short: 'WorldOfV',
    long: 'WoVNFT - MVA Phoenix',
  },
  '0xf92b2a2ff63ff09933c0ae797eff594ea3498c81': {
    short: 'WorldOfV',
    long: 'WoVNFT - Yokai',
  },
  '0xb14baed957b8e58db10ec5ef37927d83b3bbf297': {
    short: 'WorldOfV',
    long: 'WoVNFT - Ukiyoe Warriors',
  },
  '0xf19fe0f222e4f2a7587b817042fe58f4f330a009': {
    short: 'WorldOfV',
    long: 'WoVNFT - Psycho Beasts',
  },
  '0x41a03b04725c20f3902c67ee7416e5df4266df45': {
    short: 'WorldOfV',
    long: 'WoVNFT - BFFC Ladies',
  },
  '0x167f6cc1e67a615b51b5a2deaba6b9feca7069df': {
    short: 'WorldOfV',
    long: 'WoVNFT - Shredderz',
  },
  '0xda878be46f4a6ec013340fb985231ed67eb712d3': {
    short: 'WorldOfV',
    long: 'WoVNFT - Shamanic Oracles',
  },
  '0xa4bf5a32d0f1d1655eec3297023fd2136bd760a2': {
    short: 'WorldOfV',
    long: 'WoVNFT - Corgi Gang',
  },
  '0x8639b5f52f0093789f2e0f5bd2d6b9f58e8b0efb': {
    short: 'WorldOfV',
    long: 'Genesis Staking',
  },
  '0xe8a6314ae7813ba8c55568551aea223a657cffbe': {
    short: 'WorldOfV',
    long: 'UW Staking',
  },
  '0x602d006ed9da40144df3a8f3fc707d29cb651ed5': {
    short: 'WorldOfV',
    long: 'VeHash Staking',
  },
  '0x489f014285a0c45e5c82013d5c3f3b3e1274889e': {
    short: 'WorldOfV',
    long: 'Shredderz Staking',
  },
  '0x489f014285a0c45e5c82013d5c3f3b3e1274889e': {
    short: 'WorldOfV',
    long: 'Shredderz Staking',
  },
  '0x916a1b8bda7239d0336727bc821bb0a362179dac': {
    short: 'WorldOfV',
    long: 'Shredderz Staking',
  },
  '0x9899a11ecc88b88117cd5195fe9db774b011de1d': {
    short: 'WorldOfV',
    long: 'Inka Staking',
  },
  '0x2459a3649b5240ae8d851e42e64e694321e975b9': {
    short: 'WorldOfV',
    long: 'Psycho Beast Staking',
  },
  '0xc9e7060bc92959d9d2ac6b2121e4268a6b5ee651': {
    short: 'WorldOfV',
    long: 'Shamanic Oracles Staking',
  },
  '0xf5e2d450881d8c3d466dd4ff4de8838c275bbc3c': {
    short: 'WorldOfV',
    long: 'Domination Staking',
  },
  '0x34109fc2a649965eecd953d31802c67dcc183d57': {
    short: 'NO NERDS INC',
    long: 'UNION Distribution',
  },
  '0x77fe6041fa5beb0172c9ab6014b4d8d5099f0a23': {
    short: 'NO NERDS INC',
    long: 'NO NERDS Tablet NFT',
  },
  '0x955b48a46698b2b8330d75dc88ae5b95cd7ff9f4': {
    short: 'Yggdrasil',
    long: 'Yggdrasil',
  },
  '0xf72614024c9273320b2f82dda3932785df6b9208': {
    short: 'ToolChain Partners',
    long: 'Aretaeio Hospital',
  },
  '0x54f14e2e4a204a8c1b734c1b73d6d7cb96894a61': {
    short: 'ToolChain Partners',
    long: 'Undisclosed_1',
  },
  '0x91ace4b91fc65ee930724deb580dfe80c135713e': {
    short: 'ToolChain Partners',
    long: 'Undisclosed_2',
  },
  '0xc3c118c6fa5479244b9f0da0b0ba8f9afa8dc33c': {
    short: 'ToolChain Partners',
    long: 'Undisclosed_3',
  },
  '0xeddc51042586b66cf8fb75e971636c76ce2e9c35': {
    short: 'ToolChain Partners',
    long: 'Undisclosed_4',
  },
  '0x7995bdbc94ab8bd33f77457416214a4abe0b8631': {
    short: 'ToolChain Partners',
    long: 'Undisclosed_5',
  },
  '0xd9a43482cb6af1b7236cde4f7ec3201ac2a13d79': {
    short: 'ToolChain Partners',
    long: 'Undisclosed_6',
  },
  '0xf41aab18649523a18de81042bd30da07b37b1ec1': {
    short: 'ToolChain Partners',
    long: 'Undisclosed_7',
  },
  '0x11d27c2307c108990d3874b5b3dac3209bc7eee4': {
    short: 'ToolChain Partners',
    long: 'Undisclosed_8',
  },
  '0x96fa20b2162cae29b3ccb7984d3b23459200722a': {
    short: 'ToolChain Partners',
    long: 'Undisclosed_9',
  },
  '0x7977f06e9f1d7f5bf0d73cd8de24bd16ddea2cf2': {
    short: 'ToolChain Partners',
    long: 'Undisclosed_10',
  },
  '0xfee823ac958e34973d124218f8ddbe65a651a08b': {
    short: 'ToolChain Partners',
    long: 'NSF International',
  },
  '0x66f36d228a5201419dff9895dcfb8bf45c3cf262': {
    short: 'ToolChain Partners',
    long: 'San Marino Green Pass NFT',
  },
  '0xdcaa96e264eb8514b130e1a97072b41c875bec7b': {
    short: 'ToolChain Partners',
    long: 'San Marino Green Pass Data Upload',
  },
  '0x8e1bf526c0e40e8abe6a34129a1f68c2d489ac96': {
    short: 'ToolChain Partners',
    long: 'Inner Mongolia Traceability Platform',
  },
  '0x08c73b33115cafda73371a23a98ee354598a4abe': {
    short: 'Dohrnii Staking',
    long: 'Dohrnii Staking (3mo)',
  },
  '0x732c69e4cb74279e1a9a6f31764d2c4668e1cba1': {
    short: 'Dohrnii Staking',
    long: 'Dohrnii Staking (6mo)',
  },
  '0xcd88063e5bdc4416370557987fc7d15baa447b1d': {
    short: 'Dohrnii Staking',
    long: 'Dohrnii Staking (1yr)',
  },
  '0xa2bae9d627A29aE6914c7D18afCcb27664d1b436': {
    short: 'Dohrnii Staking',
    long: 'Dohrnii Staking (3yr)',
  },
  '0xe92fddd633008c1bca6e738725d2190cd46df4a1': {
    short: 'VPunks',
    long: 'VPunks VIP-181',
  },
  '0x31c71f4cd01fddd940a46dafd72d3291f52040a4': {
    short: 'VPunks',
    long: 'VPunks NFT Auction',
  },
  '0xdf71fd02fa65767b2b61a6346d7998e25987731a': {
    short: 'VPunks',
    long: 'VPunks VPU Staking',
  },
  '0x3473c5282057d7beda96c1ce0fe708e890764009': {
    short: 'ExoWorlds',
    long: 'ExoWorlds NFT',
  },
  '0xb2f12edde215e39186cc7653aeb551c8cf1f77e3': {
    short: 'ExoWorlds',
    long: 'ExoWorlds Marketplace',
  },
  '0xf99ea55a2bee3ee862d7cc61ad9e04fcb5991d5e': {
    short: 'Black VeMarket',
    long: 'Black VeMarket - Marketplace',
  },
  '0x87a4e53d6e65cdfada102818e9eab70d1230391f': {
    short: 'Black VeMarket',
    long: 'Black VeMarket - Art NFTs',
  },
  '0x6368f744862abc4d70d0714180d6d1902a86aa9b': {
    short: 'Black VeMarket',
    long: 'Singapura Dragons Staking',
  },
  '0xd56340abb721b7c89c6ca3835efc490dfd66f9ae': {
    short: 'Black VeMarket',
    long: 'VeShawties NFTs',
  },
  '0x5a45edc6311017e6b12ebfb32c28a8d36ecf7686': 'Avery Dennison',
  '0xd948e6cf79ab34b716350db4aee33cf0031cf7a1': 'XGG Black Tea',
  '0x3805c62f463f34b2f913bb09115aaa9460794d7c': 'WOV Clock Auction Genesis',
  '0x9aa9f6472a5b415dbb7dd36dfb773e09b1369288': 'Vesitors NFT',
  '0x2980f7a9bec00ee6ffee21e5fbac5e104578bf13': 'Wall of Vame',
  '0x2fd3d1e1a3f1e072c89d67301a86a5ba850ccd4e': 'Venonymous NFT',
  '0x47cce813c986b4d982a192bf7d6831f4beaccbc0': 'YEET Crusaders NFT',
  '0xa5e2ee50cb49ea4d0a3a520c15aa4cffaf5ea026': 'Gangster Gorillaz NFT',
  '0xa2c82ad2841c23a49fc2ba1a23927d1fe835c7f9': 'Vales NFT',
  '0x2ae9749952eeaa814850c90beb1e660880c5cd4b': 'Satoshi Dice',
  '0x1f1d4b35302f9e0837b8ee34e3968023fde0122c': {
    short: 'Paper Project',
    long: 'Paper Marketplace',
  },
  '0x04edc606b0d60e843528422619c6d939be8a2fcf': {
    short: 'Paper Project',
    long: 'Paper NFT',
  },
  '0x242035f42c59119b9a22d4270506c07fb792e55c': {
    short: 'VeSea',
    long: 'VeSea Profiles',
   },
  '0xa76a73bcba9b4822f31e9827aaab7953c95a66ba': {
    short: 'VeSea',
    long: 'VeSea Messenger',
   },
  '0xd5b8344eeff22332de93413e53bbdbfe472eff89': {
    short: 'VeSea',
    long: 'VeSea Market: Offers'
  },
  '0xdafca4a51ea97b3b5f21171a95dabf540894a55a': {
    short: 'VeSea',
    long: 'VeSea Market: Listings'
  },
  '0x09212be7a37a066d4707d9afbe09536656aff89b': {
    short: 'VeSea',
    long: '$VSEA Staking'
  },
  '0xabb89866a65efd45500ac9fe506179ebfb630c9b': {
    short: 'VeSea',
    long: 'VeSea Arcade: NFT Recycler'
  },
  '0x29af120f3d84d8eb76e518dd43c6e408a579f6bf': {
    short: 'VeSea',
    long: 'VeSea Arcade: VFox Burn',
   },
  '0x148442103eeadfaf8cffd593db80dcdeadda71c9': {
    short: 'VeSea',
    long: 'VeSea NFT: VeKings',
   },
  '0x588f2b0d4cbea48deb34c3d401cb995046edda81': {
    short: 'VeSea',
    long: 'VeSea NFT: VeGhosts',
   },
  '0x997c61cd02b5f2c8826ebcaf26080c650cabdda2': {
    short: 'VeSea',
    long: 'VeSea NFT: Honorary VeKings',
   },
  '0x9992501f1ef16d4b900e9d316cf468959b8f9bcd': {
    short: 'VeSea',
    long: 'VeSea NFT: Veysarum',
   },
  '0x9932690b32c4c0cd4d86a53eca948d33b1556ae7': {
    short: 'VeSea',
    long: 'VeSea NFT: VeKongs',
   },
  '0xc35d04f8783f85ede2f329eed3c1e8b036223a06': {
    short: 'VeSea',
    long: 'VeSea NFT: Galaxy Portraits',
   },
  '0x46db08ca72b205a8f9e746a9e33a30d2f379216b': {
    short: 'VeSea',
    long: 'VeSea NFT: Vumanoids',
   },
  '0x8b55d319b6cae4b9fd0b4517f29cf4a100818e38': {
    short: 'VeSea',
    long: 'VeSea NFT: Undead VeKings',
   },
  '0x8b55d319b6cae4b9fd0b4517f29cf4a100818e38': {
    short: 'VeSea',
    long: 'VeSea NFT: Sacrificed VeKings',
   },
  '0xffcc1c4492c3b49825712e9a8909e4fcebfe6c02': {
    short: 'VeSea',
    long: 'VeSea NFT: Mad Ⓥ-Apes',
   },
  '0xb12d1d640f56173ef3a47e5e1a1fde96ba96ce14': {
    short: 'VeSea',
    long: 'VeSea NFT: Mad Ⓥ-Apes Fusion',
   },
  '0x60deca6baceb6258c8d718f9987acb17176f7f24': {
    short: 'VeSea',
    long: 'VeSea NFT: universe',
   },
  '0x436f0a9b45e85eb2f749aa67d3393c649ef4dff2': {
    short: 'VeSea',
    long: 'VeSea NFT: AstroVETs',
   },
  '0x01c10830feef88258e7a1ca998009ac19f7f087e': {
    short: 'VeSea',
    long: 'VeSea NFT: VeSkullz',
   },
  '0x6aa982158617d53c37f65d43eb9a156449adfff3': {
    short: 'VeSea',
    long: 'VeSea NFT: Warbands',
   },
  '0x14c7d5357da8a8ed7a3983bc5ffd249fee63192d': {
    short: 'VeSea',
    long: 'VeSea NFT: VeNerds',
   },
  '0x5452c80cdfd31e175f62f6197e65adaf73ec84df': {
    short: 'VeSea',
    long: 'VeSea NFT: VeNerds Airdrops',
   },
  '0x88d7e38af5bdb6e65a045c79c9ce70ed06e6569b': {
    short: 'VeSea',
    long: 'VeSea NFT: New Pigs Order',
   },
  '0x1f173256c08e557d0791bc6ef2ac1b1099f57ed5': {
    short: 'VeSea',
    long: 'VeSea NFT: veLoot',
   },
  '0xC2dE1fbB24d918a68923CFb24cC541aEA7a49450': {
    short: 'VeSea',
    long: 'VeSea NFT: Victs',
   },
  '0x15e2f18feade6ccb990956050bf0c2990445cace': {
    short: 'VeSea',
    long: 'VeSea NFT: VeGnomes',
   },
  '0x207577649f08c87de98e9981712fc9aece07df79': {
    short: 'VeSea',
    long: 'VeSea NFT: uniⓋerse Expanse',
   },
  '0x0403745444204d1a0218cecbfe70b2ea42d654a6': {
    short: 'VeSea',
    long: 'VeSea NFT: Guardians',
   },
  '0xbcfc59dcc2a0977ac1e9b465566ad071e5ec06aa': {
    short: 'VeSea',
    long: 'VeSea NFT: VeNature',
   },
  '0x313d1fff2664a2df5a12e99c8c57e50efa715d73': {
    short: 'VeSea',
    long: 'VeSea NFT: Metaversials',
   },
  '0x6354b35c510cae41cd45b568087bf767756b3589': {
    short: 'VeSea',
    long: 'VeSea NFT: VeRocket',
   },
  '0x4e4faebf70e7c01bcd39adbfaa247f081819919a': {
    short: 'VeSea',
    long: 'VeSea NFT: VeeParrots',
   },
  '0x3427e769ae440ae8e18b77f49cc2d6a39e57f047': {
    short: 'VeSea',
    long: 'VeSea NFT: Frost Giant VeKings',
   },
  '0x78d4ba28c151501fa3f68927ea96304cab89b6f0': {
    short: 'VeSea',
    long: 'VeSea NFT: VFoxes',
   },
  '0xd393c0dcccae49248862b462404b63a8546a888a': {
    short: 'VeSea',
    long: 'VeSea NFT: Guardians Leaders',
   },
  '0x850a2457975fd411f03a513c6f94cd7d378e7ec1': {
    short: 'VeSea',
    long: 'VeSea NFT: Ukraine',
   },
  '0xfd5e344798ceb51afd910fafae9768e4d093a725': {
    short: 'VeSea',
    long: 'VeSea NFT: Metaversials Alteregos',
   },
  '0x2571978545672fe7e4cced7409bdd0a57bc3c3d2': {
    short: 'VeSea',
    long: 'VeSea NFT: Doppelganger',
   },
  '0x4e9eb6f6e04464eee33ae04bf430e20529482e60': {
    short: 'VeSea',
    long: 'VeSea NFT: Forest Nation - Keepers',
   },
  '0x875d36b9760ffe7ce366d3ff700c1ad98bdee990': {
    short: 'VeSea',
    long: 'VeSea NFT: Phantom VeGhosts',
   },
  '0x0c447c4311afecf8c14108fa962442444a8d3b06': {
    short: 'VeSea',
    long: 'VeSea NFT: Battle Mage V',
   },
  '0x1d971ac972f671c19d1be00e4fbf3118d3861851': {
    short: 'VeSea',
    long: 'VeSea NFT: ForestNation - Guardians',
   },
  '0x3759080b28604fd2851c215da71539bd8d5242ef': {
    short: 'VeSea',
    long: 'VeSea NFT: Kickback Koalas',
   },
  '0x3fdf191152684b417f4a55264158c2eab97a81b3': {
    short: 'VeSea',
    long: 'VeSea NFT: VFox - ORIGINS',
   },
  '0xf647e7b4fe7e0dc7ceddd038c6c004cc53163ca9': {
    short: 'VeSea',
    long: 'VeSea NFT: Shredderz Boardz',
   },
  '0x499be5332bfba0761650ae55b8d9c8443458f219': {
    short: 'VeSea',
    long: 'VeSea NFT: VVarriors',
   },
  '0xf4d82631be350c37d92ee816c2bd4d5adf9e6493': {
    short: 'VeSea',
    long: 'VeSea NFT: MinoMob',
   },
  '0xb757fc0906f08714315d2abd4b4f077521a21e34': {
    short: 'VeSea',
    long: 'VeSea NFT: VVAR DOGS',
   },
  '0xa19e999fce74ec6e9d8ce1380b4692e63e6c7cb1': {
    short: 'VeSea',
    long: 'VeSea NFT: Stardust Spectres',
   },
  '0xbcbf39013da096c97f0dc913f7ac1cdc42b9a721': {
    short: 'VeSea',
    long: 'VeSea NFT: Universal Inventory',
   },
  '0x319f08fD7c97fe0010B1f6171Debc8DcE3738A0e': {
    short: 'VeSea',
    long: 'VeSea NFT: Smuzzies',
   },
  '0x13ca388cca5e2d3c040f9d7befbc3bd20b51ae5f': {
    short: 'VeSea',
    long: 'VeSea NFT: Baby Yeet Crusaders X',
   },
  '0x0ce0c940d11FBdD73561901DbCDeF84e73A511b9': {
    short: 'VeSea',
    long: 'VeSea NFT: Stardust Spectres Access Cards',
   },
  '0xc17d84d2d19b45653abefed0b9678fcdbfc1b0b0': {
    short: 'VeSea',
    long: 'VeSea NFT: Ukiyoe Yokai Masks',
   },
}

const TOKEN_CONTRACTS = {
  '0x107a0b0faeb58c1fdef97f37f50e319833ad1b94': 'DRAGON Token',
  '0x4e17357053da4b473e2daa2c65c2c949545724b8': 'VeUSD Token',
  '0x23368c20c16f64ecbb30164a08666867be22f216': 'VSEA Token',
  '0x45429a2255e7248e57fce99e7239aed3f84b7a53': 'vVET Token',
  '0x8e57aadf0992afcc41f7843656c6c7129f738f7b': 'DHN Token',
  '0x2f10726b240d7efb08671f4d5f0a442db6f29416': 'Paper Burn Token',
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
