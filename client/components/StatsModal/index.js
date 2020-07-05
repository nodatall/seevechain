import React from 'react'
import moment from 'moment'
import { useState } from 'preact/hooks'

import Modal from 'components/Modal'
import LineChart from 'components/LineChart'

import './index.sass'

export default function StatsModal({ setVisibility, open, monthlyStats, serverTime, prices }) {
  const [range, setRange] = useState(30)

  const labels = []
  const vthoBurnSeries = []
  const txSeries = []
  const clauseSeries = []

  ;[...monthlyStats].slice(0,range).reverse().forEach(dayStat => {
    labels.push(moment(dayStat.day).format('MM/DD'))
    vthoBurnSeries.push(dayStat.vthoBurn)
    txSeries.push(dayStat.transactionCount)
    clauseSeries.push(dayStat.clauseCount)
  })

  return <Modal open={open} setVisibility={setVisibility} className="StatsModal">
    <span className="StatsModal-serverTime">
      Server time: {serverTime} (UTC+2)
    </span>
    <div className="StatsModal-prices">
      <span>
        VET
        <span className="StatsModal-prices-price">${prices.vet.usd.toFixed(5)}</span>
      </span>
      <span>
        VTHO
        <span className="StatsModal-prices-price">${prices.vtho.usd.toFixed(5)}</span>
      </span>
    </div>
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
    <Slider name="StatsModalSlider" value={range} rangeStart={4} rangeEnd={monthlyStats.length} onChange={setRange} />
  </Modal>
}

function Slider({ name, className = '', value, rangeStart, rangeEnd, onChange }) {
  return <div className={`Slider ${className}`}>
    <input
      type="range"
      step={1}
      name={name}
      min={rangeStart}
      max={rangeEnd}
      onChange={e => { onChange(e.target.value) }}
      value={value}
    />
    <label for={name}>{value} Days</label>
  </div>
}
