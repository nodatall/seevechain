const { KNOWN_CONTRACTS } = require('../../shared/knownAddresses')

const contractGroupings = {}
for (let key in KNOWN_CONTRACTS) {
  const cur = KNOWN_CONTRACTS[key]
  const newKey = typeof cur === 'string' ? cur : cur.short
  const newVal = key
  if (contractGroupings[newKey]) contractGroupings[newKey].add(newVal)
  else contractGroupings[newKey] = new Set([newVal])
}
for (let key in contractGroupings) {
  if (contractGroupings[key].size === 1) delete contractGroupings[key]
}

const invertedContractGroupings = {}
for (let key in contractGroupings) {
  ;[...contractGroupings[key]].forEach(contract => {
    invertedContractGroupings[contract] = key
  })
}

module.exports = {
  invertedContractGroupings,
}
