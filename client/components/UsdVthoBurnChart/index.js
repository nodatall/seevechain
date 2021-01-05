import React from 'react'

import useAppState from 'lib/appState'
import { colorSet3 } from 'lib/chartHelpers'
import numberWithCommas from 'lib/numberWithCommas'
import {
  getGroupsAndFilteredContractsFromTopContracts,
  onContractClick,
  getLabels,
} from 'lib/topContractHelpers'

import Spinner from 'components/Spinner'
import LineChart from 'components/LineChart'
import BarChart from 'components/BarChart'

export default function UsdVthoBurnChart({ forcePageUpdate }) {
  const currentBlock = useAppState(s => s.currentBlock)
  const dailyStats = useAppState(s => s.dailyStats)
  const topContracts = useAppState(s => s.topContracts)
  if (
    !currentBlock.dailyBurnUsd ||
    !dailyStats.length ||
    !topContracts.length
  ) return <div className="TopContractsCharts"><Spinner /></div>

  const { groups, filteredContracts } = getGroupsAndFilteredContractsFromTopContracts(topContracts)

  const usdVthoBurnTopContracts = [...filteredContracts].sort((a, b) => b.usdBurned - a.usdBurned).slice(0, 20)

  const topContractsData = {
    labels: getLabels(usdVthoBurnTopContracts, 'usdBurned', '$'),
    datasets: [{
      label: 'USD VTHO Burn by Contract',
      backgroundColor: colorSet3,
      data: usdVthoBurnTopContracts.map(contract => contract.usdBurned),
    }]
  }

  const labels = []
  const usdBurnSeries = []
  dailyStats.forEach(dayStat => {
    if (dayStat.vthoBurnUsd) {
      labels.unshift(dayStat.day)
      usdBurnSeries.unshift(Number(dayStat.vthoBurnUsd).toFixed(2))
    }
  })

  return <div className="TopContractsCharts">
    <div className="BurnTxsAndClausesCharts-avgBurn">
      USD VTHO Burn Today:
      <span>
        &nbsp;${numberWithCommas(Number(currentBlock.dailyBurnUsd).toFixed(2))}
      </span>
    </div>
    <div
      className="TopContractsCharts-chart"
      onClick={onContractClick({ contracts: usdVthoBurnTopContracts, groups, forcePageUpdate })}
    >
      <BarChart {...{ data: topContractsData }}/>
    </div>
    <LineChart
      labels={labels}
      datasets={[
        {
          label: 'Daily USD VTHO Burn',
          data: usdBurnSeries,
          borderColor: 'rgb(151, 83, 224)',
          backgroundColor: 'rgb(151, 83, 224, .1)',
        },
      ]}
      modifyOptions={options => {
        options.scales.yAxes[0].ticks.userCallback = num => window.innerWidth > 760
          ? `$${numberWithCommas(num)}`
          : `$${numeral(num).format('0.0a')}`
        options.tooltips.callbacks.label = item => `$${numberWithCommas(item.value)}`
      }}
    />
  </div>
}
