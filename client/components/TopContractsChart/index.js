import React from 'react'

import useAppState from 'lib/appState'
import { HorizontalBar } from 'react-chartjs-2'
import { useState } from 'preact/hooks'
import numeral from 'numeral'
import { getLongKnownContract, TOKEN_CONTRACTS } from '../../../shared/knownAddresses'
import numberWithCommas from 'lib/numberWithCommas'
import { colorSet, colorSet2 } from 'lib/chartHelpers'
import { invertedContractGroupings } from 'lib/contractGroupings'
import Spinner from 'components/Spinner'

import './index.sass'

export default function TopContractsChart({}) {
  const [currentGroup, setCurrentGroup] = useState()
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

  console.log(`currentGroup -->`, currentGroup)
  if (currentGroup) {
    return <div>
      In a group
      <div onClick={() => {
        setCurrentGroup()
      }}>back</div>
    </div>
  }

  return <div className="TopContractsCharts">
    <div
      className="TopContractsCharts-chart"
      onClick={event => {
        const offsetY = event.offsetY
        const segment = event.target.clientHeight / (sortedByVtho.length + 2)
        const index = Math.floor(offsetY / segment) - 1
        window.open(
          `http://www.vechainuniverse.com/Stalker/Stalk/${sortedByVtho[index].contract}`, `_blank`
        )
      }}
    >
      <HorizontalBar {...{
        data: burnData,
        options,
      }}/>
    </div>
    <div
      className="TopContractsCharts-chart"
      onClick={event => {
        const offsetY = event.offsetY
        const segment = event.target.clientHeight / (sortedByClauses.length + 2)
        const index = Math.floor(offsetY / segment) - 1
        const group = groups[sortedByClauses[index].contract]
        if (group) {
          setCurrentGroup({
            [sortedByClauses[index].contract]: group,
          })
          return
        }
        window.open(
          `http://www.vechainuniverse.com/Stalker/Stalk/${sortedByClauses[index].contract}`, `_blank`
        )
      }}
    >
      <HorizontalBar {...{
        data: clausesData,
        options,
      }}/>
    </div>
  </div>
}

function getGroupsAndFilteredContractsFromTopContracts(topContracts) {
  const groups = {}
  const filteredContracts = []
  topContracts.forEach(contract => {
    if (invertedContractGroupings[contract.contract]) {
      const group = groups[invertedContractGroupings[contract.contract]]
      if (!group) {
        groups[invertedContractGroupings[contract.contract]] = {
          activeContracts: [contract],
          totalVthoBurn: contract.vthoBurn,
          totalClauses: contract.clauses,
        }
      } else {
        group.activeContracts.push(contract)
        group.totalVthoBurn += contract.vthoBurn
        group.totalClauses += contract.clauses
      }
    } else filteredContracts.push(contract)
  })
  for (let key in groups) {
    if (groups[key].activeContracts.length === 1) {
      filteredContracts.push(groups[key].activeContracts[0])
      delete groups[key]
    } else {
      const cur = groups[key]
      filteredContracts.push({
        contract: key,
        vthoBurn: cur.totalVthoBurn,
        clauses: cur.totalClauses,
      })
    }
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
    return `${label}: ${numberWithCommas(key === 'vthoBurn' ? value.toFixed(0) : value)}${matches0x ? '' : '**'}`
  })
}
