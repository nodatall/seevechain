import React from 'react'

import { Fragment } from 'preact'
import { useLocalStorage } from 'lib/storageHooks'
import { useMemo } from 'preact/hooks'

import useAppState from 'lib/appState'
import numberWithCommas from 'lib/numberWithCommas'
import LineChart from 'components/LineChart'
import Slider from '@material-ui/core/Slider'

import './index.sass'

export default function BurnTxsAndClausesCharts() {
  const dailyStats = useAppState(s => s.dailyStats)
  const [range = [0, dailyStats.length - 1], setRange] = useLocalStorage('dailyStatsRange')
  const processedDailyStats = useMemo(
    () => {
      return dailyStats.reduce(
        (acc, dayStat) => {
          acc.labels.unshift(dayStat.day)
          acc.vthoBurnSeries.unshift(dayStat.vthoBurn)
          acc.txSeries.unshift(dayStat.transactionCount)
          acc.clauseSeries.unshift(dayStat.clauseCount)
          return acc
        },
        {
          labels: [],
          vthoBurnSeries: [],
          txSeries: [],
          clauseSeries: [],
        },
      )
    },
    [dailyStats],
  )
  const labels = reduceArrayToRange(processedDailyStats.labels, range)
  const vthoBurnSeries = reduceArrayToRange(processedDailyStats.vthoBurnSeries, range)
  const txSeries = reduceArrayToRange(processedDailyStats.txSeries, range)
  const clauseSeries = reduceArrayToRange(processedDailyStats.clauseSeries, range)

  return <Fragment>
    <LineChart
      labels={labels}
      datasets={[
        {
          label: 'VTHO Burn',
          data: vthoBurnSeries,
          borderColor: '#ffa600',
          backgroundColor: 'rgba(255, 166, 0, .1)',
        },
      ]}
    />
    <div className="BurnTxsAndClausesCharts-avgBurn">
      Avg. VTHO Burn:
      <span>
        &nbsp;{numberWithCommas((vthoBurnSeries.reduce((acc, cur) => acc + cur, 0) / vthoBurnSeries.length).toFixed())}
      </span>
    </div>
    <div className="BurnTxsAndClausesCharts-sliderRow">
      <Slider
        name="BurnTxsAndClausesChartsSlider"
        value={range || processedDailyStats.length}
        min={0}
        max={dailyStats.length - 1}
        onChange={(_, val) => setRange(val)}
        step={range[1] - range[0] < 50 ? 1 : 5}
      />
    </div>
    <LineChart
      labels={labels}
      datasets={[
        {
          borderColor: '#665191',
          backgroundColor: 'rgba(102, 81, 145, .1)',
          label: 'Txs',
          data: txSeries,
        },
        {
          borderColor: '#f95d6a',
          backgroundColor: 'rgba(355, 63, 98, .1)',
          label: 'Clauses',
          data: clauseSeries,
        },
      ]}
    />
  </Fragment>
}

function reduceArrayToRange(arr, range) {
  return arr.slice(range[0], Number(range[1]) + 1)
}
