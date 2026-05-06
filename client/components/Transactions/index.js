import React from 'react'
import { useState, useEffect } from 'preact/hooks'

import Transaction from 'components/Transaction'
import calculateInterval from 'lib/calculateInterval'
import { randomNumber } from 'lib/transactionHelpers'

import './index.sass'

const MAX_RENDERABLE_TRADES = 72
const MAX_NEW_TRADES_PER_UPDATE = 24
const SEEN_TRADE_TTL_MS = 45000
const ANIMATION_END_BUFFER_MS = 350

export default function Transactions({ trades }) {
  const [
    { renderableTransactions },
    setTransactionsState,
  ] = useState({
    renderableTransactions: [],
    transactionTimestamps: {},
  })

  useEffect(
    () => {
      setTransactionsState(({ renderableTransactions, transactionTimestamps }) => {
        const now = Date.now()
        const oldTransactionTimestamps = {...transactionTimestamps}
        Object.entries(oldTransactionTimestamps).forEach(([key, value]) => {
          if (now - value > SEEN_TRADE_TTL_MS) delete oldTransactionTimestamps[key]
        })

        const activeRenderableTransactions = renderableTransactions
          .filter(trade => !trade.removeAt || trade.removeAt > now)
        const availableSlots = Math.max(0, MAX_RENDERABLE_TRADES - activeRenderableTransactions.length)
        let newTransactions = []
        const newTransactionTimestamps = { ...oldTransactionTimestamps }
        trades.forEach(trade => {
          const key = tradeKey(trade)
          if (
            !newTransactionTimestamps[key] &&
            newTransactions.length < MAX_NEW_TRADES_PER_UPDATE &&
            newTransactions.length < availableSlots
          ) {
            newTransactionTimestamps[key] = now
            newTransactions.push(trade)
          }
        })

        const intervals = getIntervals(newTransactions)
        const animationDuration = getAnimationDuration(
          activeRenderableTransactions.length + newTransactions.length
        )
        const animationMs = getAnimationSeconds(animationDuration) * 1000
        newTransactions = newTransactions
          .map((trade, index) => ({
            ...trade,
            delay: intervals[index],
            animationDuration,
            removeAt: now + intervals[index] + animationMs + ANIMATION_END_BUFFER_MS,
          }))

        const newRenderableTransactions = [
          ...newTransactions,
          ...activeRenderableTransactions,
        ]

        return {
          renderableTransactions: newRenderableTransactions,
          transactionTimestamps: newTransactionTimestamps,
        }
      })
    },
    [trades]
  )

  const animationDuration = getAnimationDuration(renderableTransactions.length)

  return <div className="Transactions">
    {renderableTransactions.map(transaction => {
      return <Transaction
        animationDuration={transaction.animationDuration || animationDuration}
        transaction={transaction}
        key={tradeKey(transaction)}
      />
    })}
  </div>
}

function getIntervals(newTransactions) {
  if (!newTransactions.length) return []
  const interval = calculateInterval(newTransactions.length)
  const intervals = []
  for (let i = 1; i <= newTransactions.length; i++) {
    const tmpInterval = randomNumber((i * interval) - (interval / 1.35), (i * interval))
    intervals.push(tmpInterval)
  }
  return intervals
}

function getAnimationDuration(transactionCount) {
  return transactionCount < 5
    ? [1800, 5475]
    : transactionCount < 10
      ? [1623, 4612]
      : [1350, 3750]
}

function getAnimationSeconds(animationDuration) {
  const duration = (animationDuration || []).reduce((total, value) => total + Number(value || 0), 9000)
  return Math.max(5.5, Math.min(9, duration / 1000))
}

function tradeKey(trade) {
  return `${trade.coin}:${trade.timeMs}:${trade.tid}`
}
