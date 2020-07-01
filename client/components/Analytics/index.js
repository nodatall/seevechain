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

  return <div className="Analytics">
    <Header>Today: {analytics.uniqueVisits[analytics.uniqueVisits.length - 1].count}</Header>
    <div className="Analytics-chartContainer">
      <LineChart
        labels={labels}
        datasets={[
          {
            data: series,
          }
        ]}
        options={{legend: { display: false}}}
      />
    </div>
  </div>
}
