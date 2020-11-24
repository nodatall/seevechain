import React from 'react'

import useAppState from 'lib/appState'
import { HorizontalBar } from 'react-chartjs-2'
import numeral from 'numeral'
import { getLongKnownContract, TOKEN_CONTRACTS } from '../../../shared/knownAddresses'
import numberWithCommas from 'lib/numberWithCommas'
import { colorSet, colorSet2 } from 'lib/chartHelpers'

import './index.sass'

export default function TopContractsChart({}) {
  return <div>
    This chart is temporarily down for maintenance as the enormous number of clauses broke my badly optimized database query.
    It will be back soon!
  </div>

  const topContracts = useAppState(s => s.topContracts)
  const barThickness = window.innerHeight < 650
    ? 10
    : window.innerWidth > 760
      ? 30
      : 15

  const sortedByVtho = [...topContracts].sort((a, b) => b.vthoBurn - a.vthoBurn)
  const burnData = {
    labels: sortedByVtho.map(({ contract, vthoBurn }) => {
      const matchingKnownContract = getLongKnownContract(contract)
      const label = matchingKnownContract
        ? matchingKnownContract
        : TOKEN_CONTRACTS[contract]
          ? TOKEN_CONTRACTS[contract]
          : `${contract.slice(2,6)}..${contract.slice(-4)}`
      return `${label}: ${numberWithCommas(vthoBurn.toFixed(0))}`
    }

    ),
    datasets: [{
      barThickness,
      label: 'VTHO Burn by Contract',
      backgroundColor: colorSet,
      data: sortedByVtho.map(contract => contract.vthoBurn),
    }]
  }

  const sortedByClauses = [...topContracts].sort((a, b) => b.clauses - a.clauses)
  const clausesData = {
    labels: sortedByClauses.map(({ contract, clauses }) => {
      const matchingKnownContract = getLongKnownContract(contract)
      const label = matchingKnownContract
        ? matchingKnownContract
        : TOKEN_CONTRACTS[contract]
          ? TOKEN_CONTRACTS[contract]
          : `${contract.slice(2,6)}..${contract.slice(-4)}`
      return `${label}: ${numberWithCommas(clauses)}`
    }),
    datasets: [{
      barThickness,
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
        barPercentage: 0.1,
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
      onClick={event => {
        const offsetY = event.offsetY
        const segment = event.target.clientHeight / (topContracts.length + 2)
        const index = Math.floor(offsetY / segment) - 1
        window.open(
          `http://www.vechainuniverse.com/Stalker/Stalk/${topContracts[index].contract}`, `_blank`
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
        const segment = event.target.clientHeight / (topContracts.length + 2)
        const index = Math.floor(offsetY / segment) - 1
        window.open(
          `http://www.vechainuniverse.com/Stalker/Stalk/${topContracts[index].contract}`, `_blank`
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
