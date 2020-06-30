import React from 'react'
import { useEffect, useState } from 'preact/hooks'

import numberWithCommas from 'lib/numberWithCommas'

import './index.sass'

export default function BottomBar({ stats }) {
  const [numberClass, setNumberClass] = useState('BottomBar-number')
  const [initialState, setInitialState] = useState(0)

  useEffect(() => {
    if (initialState === 0) {
      setInitialState(1)
    } else {
      setNumberClass('BottomBar-number BottomBar-number-changing')
      setTimeout(() => {
        setNumberClass('BottomBar-number')
      }, 300)
    }

  }, [stats.dailyVTHOBurn])

  if (!stats || Object.keys(stats).length === 0) return <div className="BottomBar" />

  return <div className="BottomBar">
    <div className="BottomBar-wrapper">
      <div>
        <span className="BottomBar-header">Txs </span>
        <span className={numberClass}>{numberWithCommas(stats.dailyTransactions) || 0}</span>
      </div>
      <div className="BottomBar-vtho">
        <span className="BottomBar-header">VTHO {window.innerWidth < 400 ? '🔥' : 'Burn'} </span>
        <span className={numberClass}>{numberWithCommas(Math.floor(+stats.dailyVTHOBurn)) || 0}</span>
      </div>
      <div>
        <span className="BottomBar-header">Clauses </span>
        <span className={numberClass}>{numberWithCommas(stats.dailyClauses) || 0}</span>
      </div>
    </div>
  </div>
}

