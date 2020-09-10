import React from 'react'
import { Fragment } from 'preact'

import { useEffect, useState, useRef } from 'preact/hooks'
import waitFor from 'delay'

import numberWithCommas from 'lib/numberWithCommas'
import { KNOWN_CONTRACTS, KNOWN_ADDRESSES, TOKEN_CONTRACTS } from 'lib/knownAddresses'
import lightenDarkenColor from 'lib/lightenDarkenColor'
import { LIGHT_RANGE, BOX_SHADOWS } from 'lib/colors'
import { lowDing, highDing } from 'lib/sounds'
import {
  calculateCoordinates, getTransactionColorIndex, getTransactionSize, randomNumber,
} from '../../lib/transactionHelpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

import './index.sass'

const bubbleGrid = {
  windowHeight: 0,
  windowWidth: 0,
  grid: [],
}

const MOBILE_RATIO = .7

const txCount = { count: 1 }

export default function Transaction({
  transaction,
  setStats,
  statsRef,
  animationDuration,
  soundOn,
}) {
  const shouldPlaySound = useRef()
  const delay = transaction.delay
  const size = getTransactionSize(transaction.vthoBurn)
  const transitionDuration = getNumberInRange(900, 1100)
  const defaultStyle = {
    width: `${size}px`,
    height: `${size}px`,
    transition: `transform ${transitionDuration}ms ease-out, opacity 500ms, box-shadow 850ms`,
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
  const VTHOBurn = Math.round((transaction.vthoBurn) * 100) / 100

  useEffect(() => {
    shouldPlaySound.current = soundOn
  }, [soundOn])

  useEffect(() => {
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
      updateStyle(0, {
        zIndex,
        transition: `transform ${delay}ms ease-out, box-shadow 800ms`,
        boxShadow: BOX_SHADOWS[randomNumber(0, BOX_SHADOWS.length)],
      })
      await waitFor(delay)
      if (shouldPlaySound.current) {
        if (VTHOBurn > 1000) lowDing.play()
        else highDing.play()
      }
      const zIndex = txCount.count
      txCount.count += 1
      setForegroundStyle({
        ...defaultForegroundStyle,
        background: '#182024',
      })
      updateStats({setStats, statsRef, transaction})
      updateStyle(maxScale, { zIndex })
      await waitFor(secondDelay)
      updateStyle(maxScale, { transition: `transform 4s ease-out, opacity 300ms`, zIndex })
      await waitFor(thirdDelay)
      bubbleGrid.grid[row][col] = 0
      updateStyle(.7, { opacity: 0, zIndex })
      await waitFor(300)
      updateStyle(0, { transition: `transform 1ms ease-out, opacity 500ms`, opacity: 0 })
    }

    animate(animationDuration)
  }, [])

  if (!style) return

  const contracts = []
  transaction.contracts.split(', ').forEach(contract => {
    contracts.push({...KNOWN_CONTRACTS, ...TOKEN_CONTRACTS}[contract] || formatAddress(contract))
  })

  const types = transaction.types
  return <div
    className="Transaction"
    style={style}
    onClick={() => { openInNewTab(`https://insight.vecha.in/#/main/txs/${transaction.id}`) }}
  >
    <div className="Transaction-background" style={backgroundStyle} />
    <div className="Transaction-foreground" style={foregroundStyle}>
      {types.indexOf('Transfer') !== -1
        ? <TransferTransaction
          transfers={transaction.transfers}
          clauses={transaction.clauses}
          types={types}
          transferTo={transaction.transferTo}
          transferFrom={transaction.transferFrom}
        />
        : <DataTransaction contracts={contracts} VTHOBurn={VTHOBurn} types={types} clauses={transaction.clauses} />
      }
    </div>
  </div>
}

function TransferTransaction({transfers, types, transferTo = '', transferFrom = '', clauses }) {
  const toArray = transferTo.split(', ')
  const fromArray = transferFrom.split(', ')
  let toExchangeLabel
  let toLabel
  let fromExchangeLabel
  toArray.forEach(address => {
    if (KNOWN_ADDRESSES[address] && !toExchangeLabel) toExchangeLabel = KNOWN_ADDRESSES[address]
    else if (!toLabel) toLabel = formatAddress(address)
  })
  fromArray.forEach(address => {
    if (!fromExchangeLabel && KNOWN_ADDRESSES[address]) fromExchangeLabel = KNOWN_ADDRESSES[address]
  })

  let type
  let label
  if (toExchangeLabel) {
    type = 'to'
    label = toExchangeLabel
  } else if (fromExchangeLabel) {
    type = 'from'
    label = fromExchangeLabel
  } else {
    type = 'to'
    label = toLabel
  }

  return <Fragment>
    <TypeTag types={types} clauses={clauses}/>
    {transfers === '0.00' ? '< 1' : transfers} VET
    <div className="Transaction-subText">
      <div>
        {type === 'to' && <span>
          <FontAwesomeIcon
            color="green"
            icon={faArrowRight}
            size="13px"
          />&nbsp;
        </span>}
        {label}
        {type === 'from' && <span>&nbsp;
          <FontAwesomeIcon
            color="red"
            icon={faArrowRight}
            size="13px"
          />
        </span>}
      </div>
    </div>
  </Fragment>
}

function DataTransaction({contracts, VTHOBurn, types, clauses}) {
  let contract = contracts[0]
  if (contracts.includes('VIM Feeding')) contract = 'VIM Feeding'
  if (contracts.includes('VIM Dispenser')) contract = 'VIM Dispenser'
  return <Fragment>
    <TypeTag types={types} clauses={clauses}/>
    {contract}
    <div className="Transaction-subText">
      {numberWithCommas(VTHOBurn)} Burn
    </div>
  </Fragment>
}

function TypeTag({types, clauses}) {
  let className = 'Transaction-TypeTag'
  if (types.indexOf('Data') === -1) className += ' Transaction-TypeTag-transfer'
  else className += ' Transaction-TypeTag-data'
  return <div className={className}>
    {types}{clauses > 1 ? <span className="Transaction-TypeTag-clauses"> {clauses}</span> : ''}
  </div>
}

function updateStats({setStats, statsRef, transaction}) {
  statsRef.current = {
    ...statsRef.current,
    stats: {
      dailyVTHOBurn: +statsRef.current.stats.dailyVTHOBurn + +transaction.vthoBurn,
      dailyTransactions: statsRef.current.stats.dailyTransactions + 1,
      dailyClauses: +statsRef.current.stats.dailyClauses + +transaction.clauses,
    },
  }
  setStats(statsRef.current)
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
  ).click()
}

function formatAddress(address) {
  return `${address.slice(2,6)}..${address.slice(-4)}`
}
