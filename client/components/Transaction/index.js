import React from 'react'
import { Fragment } from 'preact'

import { useEffect, useState } from 'preact/hooks'
import waitFor from 'delay'

import numberWithCommas from '../../lib/numberWithCommas'
import KNOWN_ADDRESSES from '../../lib/knownAddresses'
import lightenDarkenColor from '../../lib/lightenDarkenColor'
import { LIGHT_RANGE } from '../../lib/colors'

import './index.sass'

const xyMemo = {}

export default function Transaction({ transaction, setStats, statsRef, hasTxStatsBeenCountedRef, animationDuration }) {
  const delay = transaction.delay
  const size = getTransactionSize(transaction.vthoBurn)
  const transitionDuration = getNumberInRange(900, 1100)
  const defaultStyle = {
    width: `${size}px`,
    height: `${size}px`,
    transition: `transform ${transitionDuration}ms ease-out, opacity 500ms`,
    zIndex: transaction.num,
  }
  const backgroundStyle = {
    width: `${size}px`,
    height: `${size}px`,
  }
  const colorIndex = getTransactionColorIndex(transaction.vthoBurn)
  const color = LIGHT_RANGE[Math.floor(colorIndex)]
  backgroundStyle.background = `linear-gradient(90deg, ${lightenDarkenColor(color, 40)}, ${lightenDarkenColor(color, -60)})`
  const foregroundStyle = {
    width: `${size - 3}px`,
    height: `${size - 3}px`,
  }


  const [style, setStyle] = useState()

  const maxScale = window.innerWidth <= 760 ? .6 : 1

  useEffect(() => {
    hasTxStatsBeenCountedRef.current[transaction.id] = transaction
    const bottomBarHeight = (document.querySelector('.BottomBar') || {}).clientHeight || 0
    const { xCoordinate, yCoordinate } = calculateCoordinates(size, transaction, bottomBarHeight)

    function updateStyle(scale, style = {}) {
      setStyle({
        ...defaultStyle,
        transform: `translate(${xCoordinate}px, ${yCoordinate}px) scale(${scale}) perspective(1px) translate3d(0,0,0)`,
        ...style,
      })
    }

    async function animate([secondDelay, thirdDelay]) {
      updateStyle(0)
      await waitFor(delay)
      updateStats({setStats, statsRef, transaction, hasTxStatsBeenCountedRef})
      updateStyle(maxScale)
      await waitFor(secondDelay)
      updateStyle(maxScale, { transition: `transform 4s ease-out, opacity 300ms` })
      await waitFor(thirdDelay)
      updateStyle(.7, { opacity: 0 })
      delete xyMemo[transaction.id]
      await waitFor(400)
      updateStyle(0, { transition: `transform 1ms ease-out, opacity 500ms`, opacity: 0 })
    }

    animate(animationDuration)
  }, [])

  if (!style) return

  const VTHOBurn = Math.round((transaction.vthoBurn) * 100) / 100
  const contracts = []
  transaction.contracts.split(', ').forEach(contract => {
    contracts.push(KNOWN_ADDRESSES[contract] || `${contract.slice(2,6)}..${contract.slice(-4)}`)
  })

  const types = transaction.types
  return <a href={`https://insight.vecha.in/#/main/txs/${transaction.id}`} target="_blank">
    <div className="Transaction" style={style}>
      <div className="Transaction-background" style={backgroundStyle} />
      <div className="Transaction-foreground" style={foregroundStyle}>
        {transaction.types.indexOf('Data') === -1
          ? <TransferTransaction transfers={transaction.transfers} VTHOBurn={VTHOBurn} types={types} />
          : <DataTransaction contracts={contracts} VTHOBurn={VTHOBurn} types={types} />
        }
      </div>
    </div>
  </a>
}

function TransferTransaction({transfers, VTHOBurn, types}) {
  return <Fragment>
    <TypeTag types={types} />
    {transfers === '0.00' ? '< 1' : transfers} VET
    <div className="Transaction-burn">
      {numberWithCommas(VTHOBurn)} Burn
    </div>
  </Fragment>
}

function DataTransaction({contracts, VTHOBurn, types}) {
  return <Fragment>
    <TypeTag types={types} />
    {contracts.join(', ')}
    <div className="Transaction-burn">
      {numberWithCommas(VTHOBurn)} Burn
    </div>
  </Fragment>
}

function TypeTag({types}) {
  let className = 'Transaction-TypeTag'
  if (types.indexOf('Data') === -1) className += ' Transaction-TypeTag-transfer'
  else className += ' Transaction-TypeTag-data'
  return <div className={className}>{types}</div>
}

function updateStats({setStats, statsRef, transaction, hasTxStatsBeenCountedRef}) {
  statsRef.current = {
    ...statsRef.current,
    stats: {
      dailyVTHOBurn: +statsRef.current.stats.dailyVTHOBurn + +transaction.vthoBurn,
      dailyTransactions: statsRef.current.stats.dailyTransactions + 1,
      dailyClauses: +statsRef.current.stats.dailyClauses + +transaction.clauses,
    },
  }
  setStats(statsRef.current)
  delete hasTxStatsBeenCountedRef.current[transaction.id]
  document.title = `${numberWithCommas(+statsRef.current.stats.dailyClauses)} Clauses | See VeChain`
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
  const TRANSACTION_SIZE_RANGE = [95, 115]
  let size = getRangeEquivalent(TRANSACTION_VTHO_BURN_RANGE, TRANSACTION_SIZE_RANGE, burn)
  if (size < TRANSACTION_SIZE_RANGE[0]) size = TRANSACTION_SIZE_RANGE[0]
  if (size > TRANSACTION_SIZE_RANGE[1]) size = TRANSACTION_SIZE_RANGE[1]
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
