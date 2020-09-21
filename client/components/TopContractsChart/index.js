import React from 'react'

import { HorizontalBar } from 'react-chartjs-2'
import numeral from 'numeral'
import { KNOWN_CONTRACTS, TOKEN_CONTRACTS } from 'lib/knownAddresses'
import numberWithCommas from 'lib/numberWithCommas'
import { colorSet } from 'lib/chartHelpers'

import './index.sass'

export default function TopContractsChart({ topContracts }) {
  const data = {
    labels: topContracts.map(({ contract, clauses }) => {
      const label = KNOWN_CONTRACTS[contract]
        ? KNOWN_CONTRACTS[contract]
        : TOKEN_CONTRACTS[contract]
          ? TOKEN_CONTRACTS[contract]
          : `${contract.slice(2,6)}..${contract.slice(-4)}`
      return `${label}: ${numberWithCommas(clauses)}`
    }

    ),
    datasets: [{
      barThickness: 30,
      label: 'Clauses Today',
      backgroundColor: colorSet,
      data: topContracts.map(contract => contract.clauses),
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
        label: () => 'Clauses',
      },
    },
  }

  return <div className="TopContractsChart">
    <HorizontalBar {...{ data, options }}/>
  </div>
}
