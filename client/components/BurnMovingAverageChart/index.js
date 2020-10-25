import React from 'react'
import sma from 'sma'

import { Fragment } from 'preact'

import moment from 'moment'
import LineChart from 'components/LineChart'

export default function BurnMovingAverageChart({ monthlyStats }) {
  const labels = []
  const vthoBurnSeries = []

  ;[...monthlyStats].slice(1, Number(170) + 1).reverse().forEach(dayStat => {
    labels.push(moment(dayStat.day).format('MM/DD'))
    vthoBurnSeries.push(dayStat.vthoBurn)
  })

  const twentyFiveDay = sma(vthoBurnSeries, 25)
  const fiftyDay = sma(vthoBurnSeries, 50)
  const hundredDay = sma(vthoBurnSeries, 100)

  return <Fragment>
    <LineChart
      labels={labels.slice(50)}
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
      labels={labels.slice(50)}
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
      labels={labels.slice(100)}
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
