import React from 'react'
import { HorizontalBar } from 'react-chartjs-2'
import numeral from 'numeral'

import useAppState from 'lib/appState'
import numberWithCommas from 'lib/numberWithCommas'
import { colorSet, colorSet2 } from 'lib/chartHelpers'
import { invertedContractGroupings, contractGroupings } from 'lib/contractGroupings'
import { getLongKnownContract, TOKEN_CONTRACTS } from '../../../shared/knownAddresses'
import { setPathname } from 'lib/location'
import { locationToGroupMap } from 'lib/router'

import Spinner from 'components/Spinner'
import vimworldLogo from 'assets/vimworld.jpg'
import vimworldBanner from 'assets/vimworld_banner.png'

import './index.sass'

export default function TopContractsChart({ forcePageUpdate }) {
  const topContracts = useAppState(s => s.topContracts)
  if (!topContracts.length) return <div className="TopContractsCharts"><Spinner /></div>

  const { groups, filteredContracts } = getGroupsAndFilteredContractsFromTopContracts(topContracts)

  const sortedByVtho = [...filteredContracts].sort((a, b) => b.vthoBurn - a.vthoBurn).slice(0, 20)
  const burnData = {
    labels: getLabels(sortedByVtho, 'vthoBurn'),
    datasets: [{
      label: 'VTHO Burn by Contract',
      backgroundColor: colorSet,
      data: sortedByVtho.map(contract => contract.vthoBurn),
    }]
  }

  const sortedByClauses = [...filteredContracts].sort((a, b) => b.clauses - a.clauses).slice(0, 20)
  const clausesData = {
    labels: getLabels(sortedByClauses, 'clauses'),
    datasets: [{
      label: 'Clauses by Contract',
      backgroundColor: colorSet2,
      data: sortedByClauses.map(contract => contract.clauses),
    }]
  }

  const options = {
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#bfbfc9',
        },
        maxBarThickness: 50,
      }],
      xAxes: [{
        ticks: {
          fontColor: '#bfbfc9',
          userCallback: num => window.innerWidth > 760 ? numberWithCommas(num) : numeral(num).format('0.0a'),
        },
      }]
    },
    legend: {
      onClick: () => {},
    },
    tooltips: {
      titleFontSize: 16,
      bodyFontSize: 14,
      xPadding: 12,
      yPadding: 12,
      displayColors: false,
      bodyAlign: 'center',
      backgroundColor: '#182024',
      borderColor: '#bfbfc9',
      borderWidth: .5,
      callbacks: {
        label: () => '',
      },
    },
  }

  return <div className="TopContractsCharts">
    <div
      className="TopContractsCharts-chart"
      onClick={onContractClick({ contracts: sortedByVtho, groups, forcePageUpdate })}
    >
      <HorizontalBar {...{
        data: burnData,
        options,
      }}/>
    </div>
    <div
      className="TopContractsCharts-chart"
      onClick={onContractClick({ contracts: sortedByClauses, groups, forcePageUpdate })}
    >
      <HorizontalBar {...{
        data: clausesData,
        options,
      }}/>
    </div>
  </div>
}

const groupProfileProps = {
  'VIMworld': {
    banner: vimworldBanner,
    logo: vimworldLogo,
    url: 'https://vimworld.com/',
    bio: 'VIMworld is a smart NFT platform for collectibles digital characters',
  },
}

function GroupProfile({ banner, logo, url, bio }){
  return <div className="TopContractsCharts-GroupProfile">
    <img src={banner} className="TopContractsCharts-GroupProfile-banner"/>
    <div className="TopContractsCharts-GroupProfile-logoContainer">
      <img src={logo} className="TopContractsCharts-GroupProfile-logo"/>
    </div>
    <div className="TopContractsCharts-GroupProfile-bioAndUrl">
      <div>{bio}</div>
      <a href={url} target="_blank">{url}</a>
    </div>
  </div>
}

function ContractGroup({ name, activeContracts, type, chartOptions }) {
  chartOptions.maintainAspectRatio = true
  let chartDataPoints
  let contracts
  if (type === 'burn') {
    contracts = [...activeContracts].sort((a, b) => b.vthoBurn - a.vthoBurn)
    chartDataPoints = {
      labels: getLabels(contracts, 'vthoBurn'),
      datasets: [{
        label: 'VTHO Burn by Contract',
        backgroundColor: colorSet,
        data: contracts.map(contract => contract.vthoBurn),
      }]
    }
  } else if (type === 'clauses') {
    contracts = [...activeContracts].sort((a, b) => b.clauses - a.clauses)
    chartDataPoints = {
      labels: getLabels(contracts, 'clauses'),
      datasets: [{
        label: 'Clauses by Contract',
        backgroundColor: colorSet2,
        data: contracts.map(contract => contract.clauses),
      }]
    }
  } else throw new Error(`invalid ContractGroup type ${type}`)

  const profileProps = groupProfileProps[name]

  return <div className="TopContractsCharts-ContractGroup">
    {profileProps && <GroupProfile {...{...profileProps}} />}
    <div className="TopContractsCharts-ContractGroup-header">
      {name} Contracts
    </div>
    <div
      className="TopContractsCharts-chart"
      onClick={onContractClick({ contracts, type })}
    >
      <HorizontalBar {...{
        data: chartDataPoints,
        options: chartOptions,
        height: contracts.length * 30,
      }}/>
    </div>
  </div>
}

const onContractClick = ({ contracts, groups, forcePageUpdate }) => event => {
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
    `http://www.vechainuniverse.com/Stalker/Stalk/${contracts[index].contract}`, `_blank`
  )
}

function getGroupsAndFilteredContractsFromTopContracts(topContracts) {
  const groups = {}
  for (let group in contractGroupings) {
    groups[group] = {
      activeContracts: [],
      totalClauses: 0,
      totalVthoBurn: 0,
    }
  }
  const filteredContracts = []
  topContracts.forEach(contract => {
    if (invertedContractGroupings[contract.contract]) {
      const group = groups[invertedContractGroupings[contract.contract]]
      group.activeContracts.push(contract)
      group.totalVthoBurn += contract.vthoBurn
      group.totalClauses += contract.clauses
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
        })
      }
    })
    if (cur.activeContracts.some(c => c.clauses > 0 || c.vthoBurn > 0))
      filteredContracts.push({
        contract: key,
        vthoBurn: cur.totalVthoBurn,
        clauses: cur.totalClauses,
      })
  }
  return { groups, filteredContracts }
}

function getLabels(contracts, key) {
  return contracts.map(cur => {
    const contract = cur.contract
    const value = cur[key]
    const matchingKnownContract = getLongKnownContract(contract)
    const matches0x = contract.match(/^0x/)
    const label = matchingKnownContract
      ? matchingKnownContract
      : TOKEN_CONTRACTS[contract]
        ? TOKEN_CONTRACTS[contract]
        : matches0x
          ? `${contract.slice(2,6)}..${contract.slice(-4)}`
          : `${contract}`
    return `${label}: ${numberWithCommas(value.toFixed(0))}${matches0x ? '' : '**'}`
  })
}
