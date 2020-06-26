import React from 'react'
import { Fragment } from 'preact'

import { useEffect, useState } from 'preact/hooks'
import waitFor from 'delay'

import numberWithCommas from '../../lib/numberWithCommas'
import KNOWN_ADDRESSES from '../../lib/knownAddresses'
import lightenDarkenColor from '../../lib/lightenDarkenColor'
import { LIGHT_RANGE, BOX_SHADOWS } from '../../lib/colors'

import './index.sass'

const bubbleGrid = {
  windowHeight: 0,
  windowWidth: 0,
  grid: [],
}

export default function Transaction({ transaction, setStats, statsRef, hasTxStatsBeenCountedRef, animationDuration }) {
  const delay = transaction.delay
  const size = getTransactionSize(transaction.vthoBurn)
  const transitionDuration = getNumberInRange(900, 1100)
  const defaultStyle = {
    width: `${size}px`,
    height: `${size}px`,
    transition: `transform ${transitionDuration}ms ease-out, opacity 500ms, box-shadow 800ms`,
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

  const isMobile = window.innerWidth <= 760
  const maxScale = isMobile ? .7 : 1

  useEffect(() => {
    hasTxStatsBeenCountedRef.current[transaction.id] = transaction
    const bottomBarHeight = (document.querySelector('.BottomBar') || {}).clientHeight || 0
    const { xCoordinate, yCoordinate, row, col } = calculateCoordinates(size, transaction, bottomBarHeight, isMobile)

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
      updateStyle(.1, { boxShadow: BOX_SHADOWS[randomNumber(0, BOX_SHADOWS.length)] })
      await waitFor(600)
      updateStyle(maxScale)
      await waitFor(secondDelay)
      updateStyle(maxScale, { transition: `transform 4s ease-out, opacity 300ms` })
      await waitFor(thirdDelay)
      updateStyle(.7, { opacity: 0 })
      bubbleGrid.grid[row][col] -= 1
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
  return <a
    href={`https://insight.vecha.in/#/main/txs/${transaction.id}`}
    target="_blank"
    style={{zIndex: transaction.num}}
  >
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

const MAX_TRANSACTION_SIZE = 115

function calculateCoordinates(size, transaction, bottomBarHeight, isMobile) {
  const windowHeight = window.innerHeight - bottomBarHeight - 50
  const windowWidth = window.innerWidth - 70
  const rowNum = Math.floor(windowWidth / (MAX_TRANSACTION_SIZE + 10))
  const colNum = Math.floor(windowHeight / (MAX_TRANSACTION_SIZE + 10))
  if (windowHeight !== bubbleGrid.windowHeight || windowWidth !== bubbleGrid.windowWidth) {
    bubbleGrid.windowHeight = windowHeight
    bubbleGrid.windowWidth = windowWidth
    bubbleGrid.grid = Array(rowNum).fill().map(() =>
      Array(colNum).fill().map(() => 0)
    )
  }

  const isolatedSpots = []
  const openSpots = []
  bubbleGrid.grid.forEach((row, rowIndex) => {
    bubbleGrid.grid[rowIndex].forEach((col, colIndex) => {
      if (
        !!isMobile &&
        !col &&
        bubbleGrid.grid[rowIndex + 1] && !bubbleGrid.grid[rowIndex + 1][colIndex] &&
        bubbleGrid.grid[rowIndex + 1] && !bubbleGrid.grid[rowIndex + 1][colIndex + 1] &&
        bubbleGrid.grid[rowIndex] && !bubbleGrid.grid[rowIndex][colIndex + 1] &&
        bubbleGrid.grid[rowIndex - 1] && !bubbleGrid.grid[rowIndex - 1][colIndex + 1] &&
        bubbleGrid.grid[rowIndex - 1] && !bubbleGrid.grid[rowIndex - 1][colIndex] &&
        bubbleGrid.grid[rowIndex - 1] && !bubbleGrid.grid[rowIndex - 1][colIndex - 1]
      ) isolatedSpots.push([rowIndex, colIndex])
      if (!col) openSpots.push([rowIndex, colIndex])
    })
  })

  const spots = isolatedSpots.length > 0 ? isolatedSpots : openSpots
  let row
  let col
  if (spots.length === 0) {
    row = randomNumber(1, rowNum + 1)
    col = randomNumber(0, colNum)
  } else {
    const spot = spots[randomNumber(0, spots.length - 1)]
    row = spot[0] + 1
    col = spot[1]
    bubbleGrid.grid[row - 1][col]+= 1
  }

  const extra = (MAX_TRANSACTION_SIZE + 10 - size)
  const startX = isMobile ? Math.floor((-30 - extra) * 1.3) : (-30 - extra)
  const endX = isMobile ? Math.floor(30 * 1.3) : 30
  const startY = isMobile ? Math.floor((-28) * 1.3) : -28
  const endY = isMobile ? Math.floor((28 + extra) * 1.3) : (28 + extra)
  const xCoordinate = ((((windowWidth / rowNum) * row) - (windowWidth / 2)) - 5) + randomNumber(startX, endX)
  const yCoordinate = (((windowHeight / colNum) * col) - (windowHeight / 2) - 12) + randomNumber(startY, endY)

  return {
    xCoordinate: Math.floor(xCoordinate),
    yCoordinate: Math.floor(yCoordinate),
    row: row - 1,
    col,
  }
}

function randomNumber(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

function getTransactionSize(burn) {
  const TRANSACTION_VTHO_BURN_RANGE = [14, 1000]
  const TRANSACTION_SIZE_RANGE = [95, MAX_TRANSACTION_SIZE]
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
