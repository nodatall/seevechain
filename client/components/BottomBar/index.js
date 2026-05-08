import React from 'react'
import { useEffect, useState } from 'preact/hooks'

import './index.sass'

export default function BottomBar({ marketStats, selectedMarket }) {
  const [numberClass, setNumberClass] = useState('BottomBar-number')
  const totalTrades = getTotalTrades(marketStats)
  const totalVolume = getTotalVolume(marketStats)
  const imbalance = Number((selectedMarket || {}).imbalance || 0)

  useEffect(() => {
    setNumberClass('BottomBar-number BottomBar-number-changing')
    const timeout = setTimeout(() => {
      setNumberClass('BottomBar-number')
    }, 300)

    return () => clearTimeout(timeout)
  }, [totalTrades, totalVolume, imbalance])

  return <div className="BottomBar">
    <svg height="37" width="33" xmlns="http://www.w3.org/2000/svg" version="1.1">
      <circle cx="16" cy="10" r="2" fill="grey" />
      <circle cx="16" cy="18" r="2" fill="grey" />
      <circle cx="16" cy="26" r="2" fill="grey" />
    </svg>
    <div className="BottomBar-wrapper">
      <div>
        <span className="BottomBar-header">Trades </span>
        <span className={numberClass}>{formatInteger(totalTrades)}</span>
      </div>
      <div className="BottomBar-vtho">
        <span className="BottomBar-header">24h Vol </span>
        <span className={numberClass}>{formatCurrency(totalVolume)}</span>
      </div>
      <div>
        <span className="BottomBar-header">Imbalance </span>
        <span className={numberClass}>{formatSignedCurrency(imbalance)}</span>
      </div>
    </div>
  </div>
}

function getTotalTrades(marketStats) {
  return Object.values((marketStats || {}).markets || {})
    .reduce((total, market) => total + Number(market.tradeCount || 0), 0)
}

function getTotalVolume(marketStats) {
  return Object.values((marketStats || {}).markets || {})
    .reduce((total, market) => total + Number(market.notional || market.volumeNotional || 0), 0)
}

function formatInteger(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return '0'
  return number.toLocaleString()
}

function formatCurrency(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return '$0'
  return number.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  })
}

function formatSignedCurrency(value) {
  const formatted = formatCurrency(Math.abs(value))
  if (!value) return formatted
  return `${value > 0 ? '+' : '-'}${formatted}`
}
