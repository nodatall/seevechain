import { invertedContractGroupings, contractGroupings } from 'lib/contractGroupings'
import { setPathname } from 'lib/location'
import { locationToGroupMap } from 'lib/router'
import { getLongKnownContract, TOKEN_CONTRACTS } from '../../shared/knownAddresses'
import numberWithCommas from 'lib/numberWithCommas'

export function getGroupsAndFilteredContractsFromTopContracts(topContracts) {
  const groups = {}
  for (let group in contractGroupings) {
    groups[group] = {
      activeContracts: [],
      totalClauses: 0,
      totalVthoBurn: 0,
      totalUsdBurn: 0,
    }
  }
  const filteredContracts = []
  topContracts.forEach(contract => {
    if (invertedContractGroupings[contract.contract]) {
      const group = groups[invertedContractGroupings[contract.contract]]
      group.activeContracts.push(contract)
      group.totalVthoBurn += contract.vthoBurn
      group.totalClauses += contract.clauses
      group.totalUsdBurn += Number(contract.usdBurned)
    } else filteredContracts.push(contract)
  })
  for (let key in groups) {
    const cur = groups[key]
    Array.from(contractGroupings[key]).forEach(contract => {
      if (!cur.activeContracts.some(c => c.contract === contract)) {
        cur.activeContracts.push({
          contract,
          clauses: 0,
          vthoBurn: 0,
          usdBurned: 0,
        })
      }
    })
    if (cur.activeContracts.some(c => c.clauses > 0 || c.vthoBurn > 0))
      filteredContracts.push({
        contract: key,
        vthoBurn: cur.totalVthoBurn,
        clauses: cur.totalClauses,
        usdBurned: cur.totalUsdBurn,
      })
  }
  return { groups, filteredContracts }
}

export const onContractClick = ({ contracts, groups, forcePageUpdate }) => event => {
  const offsetY = event.offsetY - 35
  if (offsetY < 0) return
  const segment = (event.target.clientHeight - 35 - 25) / contracts.length
  const index = Math.floor(offsetY / segment)
  if (!contracts[index]) return
  const group = groups && groups[contracts[index].contract]
  if (group) {
    const [url] = Object.entries(locationToGroupMap).find(([_, val]) => val === contracts[index].contract) // eslint-disable-line
    setPathname(url)
    forcePageUpdate()
    return
  }
  window.open(
    `https://vechainstats.com/account/${contracts[index].contract}`, `_blank`
  )
}

export function getLabels(contracts, key, prefix = '') {
  return contracts.map(cur => {
    const contract = cur.contract
    const value = cur[key]
    const labelValue = typeof value === 'string' ? value : value.toFixed(0)
    const matchingKnownContract = getLongKnownContract(contract)
    const matches0x = contract.match(/^0x/)
    const label = matchingKnownContract
      ? matchingKnownContract
      : TOKEN_CONTRACTS[contract]
        ? TOKEN_CONTRACTS[contract]
        : matches0x
          ? `${contract.slice(2,6)}..${contract.slice(-4)}`
          : `${contract}`
    return `${label}: ${prefix}${numberWithCommas(labelValue)}${matches0x ? '' : '*'}`
  })
}
