import React from 'react'

import useAppState from 'lib/appState'
import { HorizontalBar } from 'react-chartjs-2'
import { getLongKnownContract, TOKEN_CONTRACTS } from '../../../shared/knownAddresses'
import { colorSet2 } from 'lib/chartHelpers'
import Spinner from 'components/Spinner'
import numberWithCommas from 'lib/numberWithCommas'

export default function TopContractsChart({}) {
  const usdVthoBurn = useAppState(s => s.usdVthoBurn)
  if (!usdVthoBurn.topContracts) return <div className="TopContractsCharts"><Spinner /></div>

  const usdVthoBurnTopContracts = usdVthoBurn.topContracts.slice(0, 20)
  const topContractsData = {
    labels: usdVthoBurnTopContracts.map(({ contract, usdBurned }) => {
      const matchingKnownContract = getLongKnownContract(contract)
      const label = matchingKnownContract
        ? matchingKnownContract
        : TOKEN_CONTRACTS[contract]
          ? TOKEN_CONTRACTS[contract]
          : `${contract.slice(2,6)}..${contract.slice(-4)}`
      return `${label}: $${usdBurned}`
    }),
    datasets: [{
      label: 'USD VTHO Burn by Contract',
      backgroundColor: colorSet2,
      data: usdVthoBurnTopContracts.map(contract => contract.usdBurned),
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
          userCallback: num => `$${num}`,
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
    <div className="BurnTxsAndClausesCharts-avgBurn">
      $USD VTHO Burn Today:
      <span>
        &nbsp;${numberWithCommas(Number(usdVthoBurn.dailyBurnUsd).toFixed(2))}
      </span>
    </div>
    <div
      className="TopContractsCharts-chart"
      onClick={event => {
        const offsetY = event.offsetY
        const segment = event.target.clientHeight / (usdVthoBurnTopContracts.length + 2)
        const index = Math.floor(offsetY / segment) - 1
        window.open(
          `http://www.vechainuniverse.com/Stalker/Stalk/${usdVthoBurnTopContracts[index].contract}`, `_blank`
        )
      }}
    >
      <HorizontalBar {...{
        data: topContractsData,
        options,
      }}/>
    </div>
  </div>
}
