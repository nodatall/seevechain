import React from 'react'
import { useState, useEffect } from 'preact/hooks'

import Transaction from 'components/Transaction'
import calculateInterval from 'lib/calculateInterval'
import { randomNumber } from 'lib/transactionHelpers'

import './index.sass'

const MAX_RENDERABLE_TRADES = 72
const MAX_NEW_TRADES_PER_UPDATE = 24

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
        const oldTransactionTimestamps = {...transactionTimestamps}
        Object.entries(oldTransactionTimestamps).forEach(([key, value]) => {
          if (Date.now() - value > 20000) delete oldTransactionTimestamps[key]
        })

        let newTransactions = []
        const newTransactionTimestamps = { ...oldTransactionTimestamps }
        trades.forEach(trade => {
          const key = tradeKey(trade)
          if (!newTransactionTimestamps[key] && newTransactions.length < MAX_NEW_TRADES_PER_UPDATE) {
            newTransactionTimestamps[key] = Date.now()
            newTransactions.push(trade)
          }
        })

        const intervals = getIntervals(newTransactions)
        newTransactions = newTransactions
          .map((trade, index) => ({
            ...trade,
            delay: intervals[index],
          }))

        const newRenderableTransactions = [
          ...newTransactions,
          ...renderableTransactions.filter(trade => newTransactionTimestamps[tradeKey(trade)]),
        ].slice(0, MAX_RENDERABLE_TRADES)

        return {
          renderableTransactions: newRenderableTransactions,
          transactionTimestamps: newTransactionTimestamps,
        }
      })
    },
    [trades]
  )

  const animationDuration = renderableTransactions.length < 5
    ? [1800, 5475]
    : renderableTransactions.length < 10
      ? [1623, 4612]
      : [1350, 3750]

  return <div className="Transactions">
    {renderableTransactions.map(transaction => {
      return <Transaction
        animationDuration={animationDuration}
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

function tradeKey(trade) {
  return `${trade.coin}:${trade.timeMs}:${trade.tid}`
}
