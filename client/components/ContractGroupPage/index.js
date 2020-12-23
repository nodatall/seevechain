import React from 'react'

import useAppState from 'lib/appState'
import { locationToGroupMap } from 'lib/router'
import {
  getGroupsAndFilteredContractsFromTopContracts,
  onContractClick,
  getLabels,
} from 'lib/topContractHelpers'

import Spinner from 'components/Spinner'
import vimworldLogo from 'assets/vimworld.jpg'
import vimworldBanner from 'assets/vimworld_banner.png'

export default function ContractGroupPage({}) {
  const groupName = locationToGroupMap[window.location.pathname]
  const topContracts = useAppState(s => s.topContracts)
  if (!topContracts.length) return <div className="TopContractsCharts"><Spinner /></div>

  const { groups } = getGroupsAndFilteredContractsFromTopContracts(topContracts)

  const options = {}
  return <div>hello</div>
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