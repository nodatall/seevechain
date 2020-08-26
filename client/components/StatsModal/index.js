import React from 'react'
import moment from 'moment'
import numberWithCommas from 'lib/numberWithCommas'
import { useLocalStorage } from 'lib/storageHooks'

import Modal from 'components/Modal'
import LineChart from 'components/LineChart'
import Checkbox from 'components/Checkbox'

import './index.sass'

export default function StatsModal({ setVisibility, open, monthlyStats, serverTime, prices }) {
  const [range, setRange] = useLocalStorage('statsRange')
  const [includeToday, setIncludeToday] = useLocalStorage('includeTodayInStats')

  const labels = []
  const vthoBurnSeries = []
  const txSeries = []
  const clauseSeries = []

  const rangeStart = includeToday ? 0 : 1
  ;[...monthlyStats].slice(rangeStart, Number(range) + 1).reverse().forEach(dayStat => {
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
      ]}
    />
    <div className="StatsModal-avgBurn">
      Avg. VTHO Burn:
      <span>
        &nbsp;{numberWithCommas((vthoBurnSeries.reduce((acc, cur) => acc + cur) / vthoBurnSeries.length).toFixed())}
      </span>
    </div>
    <div className="StatsModal-sliderRow">
      <Slider
        name="StatsModalSlider"
        value={range || monthlyStats.length}
        rangeStart={4}
        rangeEnd={monthlyStats.length - 1}
        onChange={setRange}
      />
      <Checkbox
        label="Include Today"
        checked={includeToday}
        onChange={setIncludeToday}
      />
    </div>
    <LineChart
      labels={labels}
      datasets={[
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

function Slider({ name, className = '', value, rangeStart, rangeEnd, onChange }) {
  return <div className={`Slider ${className}`}>
    <input
      type="range"
      step={1}
      name={name}
      min={rangeStart}
      max={rangeEnd}
      onInput={e => { onChange(e.target.value) }}
      value={value}
    />
    <label for={name}>{value} Days</label>
  </div>
}
