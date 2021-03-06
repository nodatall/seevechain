import React from 'react'
import sma from 'sma'

import { Fragment } from 'preact'

import useAppState from 'lib/appState'
import LineChart from 'components/LineChart'

export default function BurnMovingAverageChart() {
  const dailyStats = useAppState(s => s.dailyStats)
  const labels = []
  const vthoBurnSeries = []

  ;[...dailyStats].slice(1, Number(245) + 1).reverse().forEach(dayStat => {
    labels.push(dayStat.day)
    vthoBurnSeries.push(dayStat.vthoBurn)
  })

  const sevenDay = sma(vthoBurnSeries, 7)
  const twentyFiveDay = sma(vthoBurnSeries, 25)
  const fiftyDay = sma(vthoBurnSeries, 50)
  const hundredDay = sma(vthoBurnSeries, 100)

  return <Fragment>
    <LineChart
      labels={labels.slice(6)}
      datasets={[
        {
          label: '7 Day Moving Average',
          data: sevenDay,
          borderColor: 'rgb(222, 66, 91)',
          backgroundColor: 'rgb(222, 66, 91, .1)',
        },
      ]}
    />
    <LineChart
      labels={labels.slice(24)}
      datasets={[
        {
          label: '25 Day Moving Average',
          data: twentyFiveDay,
          borderColor: 'rgb(72, 143, 49)',
          backgroundColor: 'rgb(72, 143, 49, .1)',
        },
      ]}
    />
    <LineChart
      labels={labels.slice(49)}
      datasets={[
        {
          label: '50 Day Moving Average',
          data: fiftyDay,
          borderColor: '#2f4b7c',
          backgroundColor: 'rgb(47, 75, 124, .1)',
        },
      ]}
    />
    <LineChart
      labels={labels.slice(99)}
      datasets={[
        {
          label: '100 Day Moving Average',
          data: hundredDay,
          borderColor: 'rgb(255, 166, 0)',
          backgroundColor: 'rgb(255, 166, 0, .1)',
        },
      ]}
    />
  </Fragment>
}
