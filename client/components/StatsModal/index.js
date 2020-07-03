import React from 'react'

import Header from 'components/Header'
import Modal from 'components/Modal'
import LineChart from 'components/LineChart'

import './index.sass'

export default function StatsModal({ setVisibility, open, monthlyStats, serverTime }) {
  const labels = []
  const vthoBurnSeries = []
  const txSeries = []
  const clauseSeries = []

  ;[...monthlyStats].reverse().forEach(dayStat => {
    labels.push(dayStat.day)
    vthoBurnSeries.push(dayStat.vthoBurn)
    txSeries.push(dayStat.transactionCount)
    clauseSeries.push(dayStat.clauseCount)
  })

  return <Modal open={open} setVisibility={setVisibility} className="StatsModal">
    <div className="StatsModal-serverTime">
      Server time: {serverTime} (UTC + 2)
    </div>
    <Header size="md">Last 30 days</Header>
    <LineChart
      labels={labels}
      datasets={[
        {
          label: 'VTHO Burn',
          data: vthoBurnSeries,
          borderColor: '#ffa600',
          backgroundColor: 'rgba(255, 166, 0, .1)',
        },
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
  </Modal>
}
