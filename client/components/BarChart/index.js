import React from 'react'
import { HorizontalBar } from 'react-chartjs-2'
import numberWithCommas from '../../lib/numberWithCommas'
import numeral from 'numeral'

export default function BarChart({ data, options = {}, modifyOptions }) {
  options = {
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#bfbfc9',
        },
        maxBarThickness: 50,
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
    ...options,
  }
  if (modifyOptions) modifyOptions(options)

  return <HorizontalBar {...{
    data,
    options,
  }}/>
}
