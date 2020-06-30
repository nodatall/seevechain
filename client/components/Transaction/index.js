import React from 'react'
import { Fragment } from 'preact'

import { useEffect, useState } from 'preact/hooks'
import waitFor from 'delay'

import numberWithCommas from '../../lib/numberWithCommas'
import KNOWN_ADDRESSES from '../../lib/knownAddresses'
import lightenDarkenColor from '../../lib/lightenDarkenColor'
import { LIGHT_RANGE, BOX_SHADOWS } from '../../lib/colors'
import {
  calculateCoordinates, getTransactionColorIndex, getTransactionSize, randomNumber,
} from '../../lib/transactionHelpers'

import './index.sass'

const bubbleGrid = {
  windowHeight: 0,
  windowWidth: 0,
  grid: [],
}

const MOBILE_RATIO = .7

const txCount = { count: 1 }

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

  const [style, setStyle] = useState()
  const defaultForegroundStyle = {
    width: `${size - 3}px`,
    height: `${size - 3}px`,
  }
  const [foregroundStyle, setForegroundStyle] = useState({
    ...defaultForegroundStyle,
    background: 'white',
    transition: 'background-color 200ms linear',
  })

  const isMobile = window.innerWidth <= 760
  const maxScale = isMobile ? MOBILE_RATIO : 1

  useEffect(() => {
    hasTxStatsBeenCountedRef.current[transaction.id] = transaction
    const bottomBarHeight = (document.querySelector('.BottomBar') || {}).clientHeight || 0
    const { xCoordinate, yCoordinate, row, col } = calculateCoordinates({
      size, bottomBarHeight, isMobile, bubbleGrid, mobileRatio: MOBILE_RATIO,
    })

    function updateStyle(scale, style = {}) {
      setStyle({
        ...defaultStyle,
        transform: `translate(${xCoordinate}px, ${yCoordinate}px) scale(${scale}) perspective(1px) translate3d(0,0,0)`,
        ...style,
      })
    }

    async function animate([secondDelay, thirdDelay]) {
      updateStyle(0)
      const miniDelay = delay / 10
      await waitFor(miniDelay)
      updateStyle(.05, {
        zIndex,
        transition: `transform ${delay}ms ease-out, box-shadow 800ms`,
      })
      await waitFor(delay - miniDelay)
      const zIndex = txCount.count
      txCount.count += 1
      setForegroundStyle({
        ...defaultForegroundStyle,
        background: '#182024',
      })
      updateStyle(.1, { boxShadow: BOX_SHADOWS[randomNumber(0, BOX_SHADOWS.length)], zIndex })
      await waitFor(530)
      updateStats({setStats, statsRef, transaction, hasTxStatsBeenCountedRef})
      updateStyle(maxScale, { zIndex })
      await waitFor(secondDelay)
      updateStyle(maxScale, { transition: `transform 4s ease-out, opacity 300ms`, zIndex })
      await waitFor(thirdDelay)
      updateStyle(.7, { opacity: 0, zIndex })
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
  return <div
    className="Transaction"
    style={style}
    onClick={() => { openInNewTab(`https://insight.vecha.in/#/main/txs/${transaction.id}`) }}
  >
    <div className="Transaction-background" style={backgroundStyle} />
    <div className="Transaction-foreground" style={foregroundStyle}>
      {transaction.types.indexOf('Data') === -1
        ? <TransferTransaction transfers={transaction.transfers} VTHOBurn={VTHOBurn} types={types} />
        : <DataTransaction contracts={contracts} VTHOBurn={VTHOBurn} types={types} />
      }
    </div>
  </div>
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

function openInNewTab(href) {
  Object.assign(
    document.createElement('a'), {
      target: '_blank',
      href,
    }
  ).click().remove()
}
