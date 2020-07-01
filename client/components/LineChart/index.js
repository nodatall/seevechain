import React from 'react'
import { Line } from 'react-chartjs-2'

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
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        gridLines: {
          color: 'grey',
          lineWidth: .5,
        },
        ticks: {
          fontColor: '#bfbfc9',
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
    ...options,
  }

  return <Line data={data} options={options} />
}
