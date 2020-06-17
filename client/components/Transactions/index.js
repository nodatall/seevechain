import React, { Component } from 'react'

import Transaction from 'components/Transaction'
import calculateInterval from '../../lib/calculateInterval'

export default class Transactions extends Component {

  state = {
    renderableTransactions: [],
    transactionTimestamps: {},
  }

  componentDidMount = () => {
    this.setRenderableTransactions(this.props.transactions)
  }

  setRenderableTransactions = transactions => {
    const oldTransactionTimestamps = {...this.state.transactionTimestamps}
    Object.entries(oldTransactionTimestamps).forEach(([key, value]) => {
      if (Date.now() - value > 40000) delete oldTransactionTimestamps[key]
    })

    let newTransactions = []
    const transactionTimestamps = { ...oldTransactionTimestamps }
    transactions.forEach(transaction => {
      if (!transactionTimestamps[transaction.id]) {
        transactionTimestamps[transaction.id] = Date.now()
        newTransactions.push(transaction)
      }
    })

    const interval = calculateInterval(newTransactions.length)
    const intervals = []
    let difference
    for (let i = 0; i < newTransactions.length; i++) {
      const tmpInterval = (i * interval) + 150
      if (!difference) intervals.push(tmpInterval)
      else if (i % 2 === 1) {
        difference = getNumberInRange(tmpInterval * .90, tmpInterval)
        intervals.push(tmpInterval - difference)
      } else {
        intervals.push(tmpInterval + difference)
      }
    }
    newTransactions = newTransactions
      .map((transaction, index) => {
        transaction.delay = intervals[index]
        return transaction
      })

    const renderableTransactions = [
      ...newTransactions,
      ...this.state.renderableTransactions.filter(transaction => transactionTimestamps[transaction.id]),
    ]

    this.setState({
      transactionTimestamps,
      renderableTransactions,
    })
  }

  componentWillReceiveProps = nextProps => {
    this.setRenderableTransactions(nextProps.transactions)
  }

  render() {
    const { setStats, statsRef, hasTxStatsBeenCountedRef } = this.props
    const { renderableTransactions } = this.state
    if (!renderableTransactions.length) return
    const animationDuration = renderableTransactions.length < 5
      ? [1800, 5475]
      : renderableTransactions.length < 5
        ? [1623, 4612]
        : [1350, 3750]
    return renderableTransactions.map(transaction => {
      return <Transaction
        animationDuration={animationDuration}
        transaction={transaction}
        key={transaction.id}
        setStats={setStats}
        statsRef={statsRef}
        hasTxStatsBeenCountedRef={hasTxStatsBeenCountedRef}
      />
    })
  }
}
