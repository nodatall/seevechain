import React, { Component } from 'react'
import { useEffect, useState } from 'preact/hooks'
import numberWithCommas from '../../lib/numberWithCommas'
import calculateInterval from '../../lib/calculateInterval'
import { LIGHT_RANGE, DARK_RANGE } from '../../lib/colors'
import KNOWN_ADDRESSES from '../../lib/knownAddresses'

import './index.sass'

const xyMemo = {}

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
    newTransactions = newTransactions.map((transaction, index) => {
      transaction.delay = intervals[index]
      return transaction
    })

    const renderableTransactions = [
      ...newTransactions,
      ...this.state.renderableTransactions.filter(transaction => transactionTimestamps[transaction.id])
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
    return renderableTransactions.map(transaction => {
      return <Transaction
        transaction={transaction}
        key={transaction.id}
        setStats={setStats}
        statsRef={statsRef}
        hasTxStatsBeenCountedRef={hasTxStatsBeenCountedRef}
      />
    })
  }
}

function Transaction({ transaction, setStats, statsRef, hasTxStatsBeenCountedRef }) {
  const delay = transaction.delay
  const size = getTransactionSize(transaction.vthoBurn)
  const transitionDuration = getNumberInRange(900, 1100)
  const defaultStyle = {
    width: `${size}px`,
    height: `${size}px`,
    transition: `transform ${transitionDuration}ms ease-out, opacity 500ms`,
  }

  const colorIndex = getTransactionColorIndex(transaction.vthoBurn)
  defaultStyle.border = `2px solid ${LIGHT_RANGE[Math.floor(colorIndex)]}`

  const [style, setStyle] = useState()

  const maxScale = window.innerWidth <= 760 ? .6 : 1

  useEffect(() => {
    hasTxStatsBeenCountedRef.current[transaction.id] = transaction
    const bottomBarHeight = (document.querySelector('.BottomBar') || {}).clientHeight || 0
    const { xCoordinate, yCoordinate } = calculateCoordinates(size, transaction, bottomBarHeight)
    setStyle({
      ...defaultStyle,
      transform: `translate(${xCoordinate}px, ${yCoordinate}px) scale(0) perspective(1px) translate3d(0,0,0)`,
    })

    setTimeout(() => {
      statsRef.current = {
        ...statsRef.current,
        stats: {
          dailyVTHOBurn: +statsRef.current.stats.dailyVTHOBurn + +transaction.vthoBurn,
          dailyTransactions: statsRef.current.stats.dailyTransactions + 1,
          dailyClauses: statsRef.current.stats.dailyClauses + transaction.clauses,
        },
      }
      setStats(statsRef.current)
      delete hasTxStatsBeenCountedRef.current[transaction.id]
      setStyle({
        ...defaultStyle,
        transform: `translate(${xCoordinate}px, ${yCoordinate}px) scale(${maxScale}) perspective(1px) translate3d(0,0,0)`,
      })
      setTimeout(() => {
        setStyle({
          ...defaultStyle,
          transform: `translate(${xCoordinate}px, ${yCoordinate}px) scale(${maxScale}) perspective(1px) translate3d(0,0,0)`,
          transition: `transform 4s ease-out, opacity 300ms`,
        })
      }, 1050)
      setTimeout(() => {
        setStyle({
          ...defaultStyle,
          transform: `translate(${xCoordinate}px, ${yCoordinate}px) scale(.7) perspective(1px) translate3d(0,0,0)`,
          opacity: 0,
        })
        delete xyMemo[transaction.id]
        setTimeout(() => {
          setStyle({
            ...defaultStyle,
            transform: `translate(${xCoordinate}px, ${yCoordinate}px) scale(0) perspective(1px) translate3d(0,0,0)`,
            transition: `transform 1ms ease-out, opacity 500ms`,
            opacity: 0,
          })
        }, 50)
      }, 4500)
    }, delay)
  }, [])

  if (!style) return

  const VTHOBurn = Math.round((transaction.vthoBurn) * 100) / 100
  const contract = KNOWN_ADDRESSES[transaction.contract]
    || `${transaction.contract.slice(2,6)}..${transaction.contract.slice(-4)}`

  return <a href={`https://insight.vecha.in/#/main/txs/${transaction.id}`} target="_blank">
    <div className="Transaction" style={style}>
      <div className="Transaction-contract">
        {contract}
      </div>
      <div>{numberWithCommas(VTHOBurn)}</div>
    </div>
  </a>
}

function getNumberInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function calculateCoordinates(size, transaction, bottomBarHeight, attempts = 0) {
  const windowHeight = window.innerHeight
  const windowWidth = window.innerWidth

  const xPlusOrMinus = randomPlusMinus()
  const maxX = xPlusOrMinus === '-'
    ? (windowWidth / 2) - size
    : windowWidth / 2

  const yPlusOrMinus = randomPlusMinus()
  const maxY = yPlusOrMinus === '-'
    ? (windowHeight / 2)
    : (windowHeight / 2) - size - bottomBarHeight

  const x = randomNumber(0, maxX)
  const y = randomNumber(0, maxY)

  const xCoordinate = `${xPlusOrMinus}${x}`
  const yCoordinate = `${yPlusOrMinus}${y}`

  if (attempts > 50) return {
    xCoordinate,
    yCoordinate,
  }

  const valid = attempts < 40
    ? 100
    : attempts < 60
      ? 50
      : attempts < 80
        ? 25
        : attempts < 100
          ? 10
          : 5
  if (!validCoordinates(xCoordinate, yCoordinate, valid)) {
    return calculateCoordinates(size, transaction, bottomBarHeight, attempts + 1)
  }

  xyMemo[transaction.id] = [xCoordinate, yCoordinate]

  return {
    xCoordinate,
    yCoordinate,
  }
}

function validCoordinates(xCoordinate, yCoordinate, valid = 50) {
  return Object.values(xyMemo).every(([x,y]) => {
    return getDifference(x, xCoordinate) > valid
      && getDifference(y, yCoordinate) > valid
  })
}

function getDifference(p1, p2) {
  let difference
  if ((p1 < 0 && p2 > 0) || (p1 > 0 && p2 < 0)) {
    difference = Math.abs(p1) + Math.abs(p2)
  } else {
    difference = Math.abs(p1 - p2)
  }
  return difference
}

function randomNumber(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

function randomPlusMinus() {
  return Math.random() >= .5
    ? '-'
    : '+'
}

function getTransactionSize(burn) {
  const TRANSACTION_VTHO_BURN_RANGE = [14, 1000]
  const TRANSACTION_SIZE_RANGE = [80, 110]
  let size = getRangeEquivalent(TRANSACTION_VTHO_BURN_RANGE, TRANSACTION_SIZE_RANGE, burn)
  if (size < TRANSACTION_SIZE_RANGE[0]) size = TRANSACTION_SIZE_RANGE[0]
  if (size > TRANSACTION_SIZE_RANGE[1]) size = TRANSACTION_SIZE_RANGE[1] + (size / 100)
  return Math.floor(size)
}

function getTransactionColorIndex(burn) {
  const BURN_RANGE = [14, 1600]
  const COLOR_RANGE = [0, LIGHT_RANGE.length - 1]
  let colorIndex = getRangeEquivalent(BURN_RANGE, COLOR_RANGE, burn)
  if (colorIndex > LIGHT_RANGE.length - 1) colorIndex = LIGHT_RANGE.length - 1
  return colorIndex
}

function getRangeEquivalent(r1, r2, num) {
  const ratio = num / (r1[0] + r1[1])
  return (r2[0] + r2[1]) * ratio
}
