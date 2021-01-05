import React from 'react'
import { useState, useEffect } from 'preact/hooks'

import useAppState from 'lib/appState'
import Transaction from 'components/Transaction'
import calculateInterval from 'lib/calculateInterval'
import { randomNumber } from 'lib/transactionHelpers'

import './index.sass'

export default function Transactions({ currentBlockRef, soundOn }) {
  const [
    { renderableTransactions },
    setTransactionsState,
  ] = useState({
    renderableTransactions: [],
    transactionTimestamps: {},
  })
  const { transactions } = useAppState(s => s.currentBlock)

  useEffect(
    () => {
      setTransactionsState(({ renderableTransactions, transactionTimestamps }) => {
        const oldTransactionTimestamps = {...transactionTimestamps}
        Object.entries(oldTransactionTimestamps).forEach(([key, value]) => {
          if (Date.now() - value > 20000) delete oldTransactionTimestamps[key]
        })

        let newTransactions = []
        const newTransactionTimestamps = { ...oldTransactionTimestamps }
        transactions.forEach(transaction => {
          if (!newTransactionTimestamps[transaction.id]) {
            newTransactionTimestamps[transaction.id] = Date.now()
            newTransactions.push(transaction)
          }
        })

        const intervals = getIntervals(newTransactions)
        newTransactions = newTransactions
          .map((transaction, index) => {
            transaction.delay = intervals[index]
            return transaction
          })

        const newRenderableTransactions = [
          ...newTransactions,
          ...renderableTransactions.filter(transaction => newTransactionTimestamps[transaction.id]),
        ]

        return {
          renderableTransactions: newRenderableTransactions,
          transactionTimestamps: newTransactionTimestamps,
        }
      })
    },
    [transactions]
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
        key={transaction.id}
        currentBlockRef={currentBlockRef}
        soundOn={soundOn}
      />
    })}
  </div>
}

function getIntervals(newTransactions) {
  const interval = calculateInterval(newTransactions.length)
  const intervals = []
  for (let i = 1; i <= newTransactions.length; i++) {
    const tmpInterval = randomNumber((i * interval) - (interval / 1.35), (i * interval))
    intervals.push(tmpInterval)
  }
  return intervals
}
