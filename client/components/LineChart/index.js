import React from 'react'
import { Line } from 'react-chartjs-2'
import numberWithCommas from '../../lib/numberWithCommas'
import numeral from 'numeral'

import './index.sass'

export default function LineChart({ labels, datasets, options = {} }) {
  const onMobile = window.innerWidth < 600
  const defaultDataset = {
    fill: true,
    backgroundColor: '#363c4f',
    borderColor: '#bfbfc9',
    borderWidth: 1.5,
    pointBorderColor: '#bfbfc9',
    pointBackgroundColor: '#bfbfc9',
    pointRadius: onMobile ? .5 : 2,
    pointHoverRadius: 4,
    pointHoverBackgroundColor: '#bfbfc9',
    pointHoverBorderColor: 'rgba(220,220,220,1)',
    pointHoverBorderWidth: .2,
    pointHitRadius: onMobile ? 5 : 10,
    lineTension: .2,
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
          userCallback: num => window.innerWidth > 760 ? numberWithCommas(num) : numeral(num).format('0.0a'),
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
      callbacks: {
        label: item => numberWithCommas(item.value),
      },
    },
    animation: {
      duration: 0,
    },
    ...options,
  }

  return <Line data={data} options={options} />
}
