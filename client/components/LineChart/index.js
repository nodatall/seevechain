import React from 'react'
import { Line } from 'react-chartjs-2'
import numberWithCommas from '../../lib/numberWithCommas'

import './index.sass'

export default function LineChart({ labels, datasets, options = {} }) {
  const defaultDataset = {
    fill: true,
    backgroundColor: '#363c4f',
    borderColor: '#b3c0f9',
    borderWidth: 1.5,
    pointBorderColor: '#b3c0f9',
    pointBackgroundColor: '#fff',
    pointHoverRadius: 5,
    pointHoverBackgroundColor: '#363c4f',
    pointHoverBorderColor: 'rgba(220,220,220,1)',
    pointHoverBorderWidth: 2,
    pointHitRadius: 10,
  }

  const data = {
    labels,
    datasets: datasets.map(dataset => ({
      ...defaultDataset,
      ...dataset,
    }))
  }

  options = {
    scales: {
      yAxes: [{
        gridLines: {
          color: 'grey',
          lineWidth: .5,
        },
        ticks: {
          fontColor: '#bfbfc9',
          userCallback: numberWithCommas,
          lineHeight: 2,
        },
      }],
      xAxes: [{
        gridLines: {
          color: 'grey',
          lineWidth: .5,
        },
        ticks: {
          fontColor: '#bfbfc9',
        },
      }]
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
    },
    ...options,
  }

  return <Line data={data} options={options} />
}
