import React from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import Spinner from 'components/Spinner'
import Header from 'components/Header'
import LineChart from 'components/LineChart'
import { useEffect, useState } from 'preact/hooks'

import './index.sass'

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    setInterval(() => {
      axios.get('/api/visitor_analytics').then(({data}) => {
        if (data.error) console.error('error get /api/visitor_analytics', data.error)
        setAnalytics({ uniqueVisits: data.uniqueVisits })
      })
    }, 10000)
  }, [])
  if (!Cookies.get('seeVechainAuthorized')) return <div className="Analytics">Unauthorized</div>
  if (!analytics) return <div className="Analytics"><Spinner /></div>

  const labels = []
  const series = []
  analytics.uniqueVisits.reverse().forEach(({ count, date }) => {
    labels.push(date)
    series.push(count)
  })

  return <div className="Analytics">
    <Header>Today: {analytics.uniqueVisits[analytics.uniqueVisits.length - 1].count}</Header>
    <div className="Analytics-chartContainer">
      <LineChart
        labels={labels}
        datasets={[
          {
            label: 'VTHO Burn',
            data: series,
          }
        ]}
        options={{legend: { display: false }, maintainAspectRatio: false }}
      />
    </div>
  </div>
}
