import React from 'react'

import useAppState from 'lib/appState'
import { locationToGroupMap } from 'lib/router'
import {
  getGroupsAndFilteredContractsFromTopContracts,
  onContractClick,
  getLabels,
} from 'lib/topContractHelpers'
import { colorSet, colorSet2, colorSet3 } from 'lib/chartHelpers'

import BarChart from 'components/BarChart'
import Spinner from 'components/Spinner'
import vimworldIcon from 'assets/vimworld_icon.jpg'
import vimworldBanner from 'assets/vimworld_banner.png'
import vulcanIcon from 'assets/vulcan_icon.png'
import vulcanBanner from 'assets/vulcan_banner.png'

import './index.sass'

export default function ContractGroupPage({}) {
  const groupName = locationToGroupMap[window.location.pathname]
  const topContracts = useAppState(s => s.topContracts)
  if (!topContracts.length) return <div className="ContractGroupPage"><Spinner /></div>

  const { groups } = getGroupsAndFilteredContractsFromTopContracts(topContracts)
  const group = groups[groupName]

  return <ContractGroup {...{
    name: groupName,
    activeContracts: group.activeContracts,
    type: 'burn',
  }} />
}

const groupProfileProps = {
  'VIMworld': {
    banner: vimworldBanner,
    logo: vimworldIcon,
    url: 'https://vimworld.com/',
    bio: 'VIMworld is a smart NFT platform for collectibles digital characters',
  },
  'Vulcan': {
    banner: vulcanBanner,
    logo: vulcanIcon,
    url: 'https://vulcanverse.com/',
    bio: 'VulcanVerse is a virtual world set in the Greco-Roman era utilizing blockchain to enable users to own land and assets. ',
  },
}

function GroupProfile({ banner, logo, url, bio }){
  return <div className="ContractGroupPage-GroupProfile">
    <img src={banner} className="ContractGroupPage-GroupProfile-banner"/>
    <div className="ContractGroupPage-GroupProfile-logoContainer">
      <img src={logo} className="ContractGroupPage-GroupProfile-logo"/>
    </div>
    <div className="ContractGroupPage-GroupProfile-bioAndUrl">
      <div>{bio}</div>
      <a href={url} target="_blank">{url}</a>
    </div>
  </div>
}

function ContractGroup({ name, activeContracts }) {
  const burnContracts = [...activeContracts].sort((a, b) => b.vthoBurn - a.vthoBurn)
  const burnDataPoints = {
    labels: getLabels(burnContracts, 'vthoBurn'),
    datasets: [{
      label: 'VTHO Burn by Contract',
      backgroundColor: colorSet,
      data: burnContracts.map(contract => contract.vthoBurn),
    }]
  }
  const clausesContracts = [...activeContracts].sort((a, b) => b.clauses - a.clauses)
  const clausesDataPoints = {
    labels: getLabels(clausesContracts, 'clauses'),
    datasets: [{
      label: 'Clauses by Contract',
      backgroundColor: colorSet2,
      data: clausesContracts.map(contract => contract.clauses),
    }]
  }

  const usdBurnContracts = [...activeContracts].sort((a, b) => b.usdBurned - a.usdBurned)
  const usdBurnDataPoints = {
    labels: getLabels(usdBurnContracts, 'usdBurned', '$'),
    datasets: [{
      label: 'USD VTHO Burn by Contract',
      backgroundColor: colorSet3,
      data: usdBurnContracts.map(contract => contract.usdBurned),
    }]
  }


  const profileProps = groupProfileProps[name]

  return <div className="ContractGroupPage-ContractGroup">
    {profileProps && <GroupProfile {...{...profileProps}} />}
    <div className="ContractGroupPage-ContractGroup-header">
      {name} Contracts
    </div>
    <div
      className="ContractGroupPage-chart"
      onClick={onContractClick({ contracts: burnContracts })}
    >
      <BarChart {...{
        data: burnDataPoints,
        height: burnContracts.length * 80,
      }}/>
    </div>
    <div
      className="ContractGroupPage-chart"
      onClick={onContractClick({ contracts: clausesContracts })}
    >
      <BarChart {...{
        data: clausesDataPoints,
        height: clausesContracts.length * 80,
      }}/>
    </div>
    <div
      className="ContractGroupPage-chart"
      onClick={onContractClick({ contracts: usdBurnContracts })}
    >
      <BarChart {...{
        data: usdBurnDataPoints,
        height: usdBurnContracts.length * 80,
      }}/>
    </div>
  </div>
}
