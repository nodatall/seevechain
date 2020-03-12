import React from 'react'

import numberWithCommas from '../../lib/numberWithCommas'

import './index.sass'

export default function BottomBar({ stats }) {
  if (!stats || Object.keys(stats).length === 0) return <div className="BottomBar" />
  return <div className="BottomBar">
    <div className="BottomBar-wrapper">
      <div>
        <span className="BottomBar-header">VTHO Burn: </span>
        {numberWithCommas(Math.floor(+stats.dailyVTHOBurn))}
      </div>
      <div>
        <span className="BottomBar-header">Txs: </span>
        {numberWithCommas(stats.dailyTransactions)}
      </div>
      <div>
        <span className="BottomBar-header">Clauses: </span>
        {numberWithCommas(stats.dailyClauses)}
      </div>
    </div>
  </div>
}

