import React from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import Spinner from 'components/Spinner'
import { useEffect, useState } from 'preact/hooks'
import { Line } from 'react-chartjs-2'

import './index.sass'

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    axios.get('/api/visitor_analytics').then(({data}) => {
      setAnalytics({ uniqueVisits: data.uniqueVisits })
    })
  }, [])
  if (!Cookies.get('seeVechainAuthorized')) return <div className="Analytics">Unauthorized</div>
  if (!analytics) return <div className="Analytics"><Spinner /></div>

  const labels = []
  const series = []
  analytics.uniqueVisits.reverse().forEach(({ count, date }) => {
    labels.push(date)
    series.push(count)
  })

  const data = {
    labels,
    datasets: [
      {
        label: `Visits: ${analytics.uniqueVisits[analytics.uniqueVisits.length - 1].count}`,
        fill: true,
        lineTension: 0.1,
        backgroundColor: '#363c4f',
        borderColor: '#b3c0f9',
        borderWidth: 1.5,
        pointBorderColor: '#b3c0f9',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: series,
      }
    ]
  }

  const options = {
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
    }
  }

  return <div className="Analytics">
    <div><Line data={data} options={options} /></div>
  </div>
}
