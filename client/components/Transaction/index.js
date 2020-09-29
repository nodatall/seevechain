import React from 'react'
import { Fragment } from 'preact'

import { useEffect, useState, useRef } from 'preact/hooks'
import waitFor from 'delay'
import numeral from 'numeral'

import numberWithCommas from 'lib/numberWithCommas'
import { KNOWN_CONTRACTS, KNOWN_ADDRESSES, TOKEN_CONTRACTS } from 'lib/knownAddresses'
import lightenDarkenColor from 'lib/lightenDarkenColor'
import { LIGHT_RANGE, BOX_SHADOWS } from 'lib/colors'
import { highDing, lowDing } from 'lib/sounds'
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
  const backgroundStyle = getBackgroundStyle({ transaction, size })

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
        if (VTHOBurn > 1000) highDing.play()
        else lowDing.play()
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

  const types = new Set()
  transaction.clauses.forEach(clause => {
    types.add(clause.type)
  })

  return <div
    className="Transaction"
    style={style}
    onClick={() => { openInNewTab(`https://insight.vecha.in/#/main/txs/${transaction.id}`) }}
  >
    <div className="Transaction-background" style={backgroundStyle} />
    <div className="Transaction-foreground" style={foregroundStyle}>
      {types.has('Transfer') && types.size === 1
        ? <TransferTransaction clauses={transaction.clauses} />
        : <DataTransaction transaction={transaction} VTHOBurn={VTHOBurn} types={[...types]} />
      }
    </div>
  </div>
}

function TransferTransaction({ clauses }) {
  const senders = []
  const recipients = []
  const amountsByToken = {}

  clauses.forEach(clause => {
    senders.push(clause.transfer_sender)
    recipients.push(clause.transfer_recipient)
    amountsByToken[clause.transfer_token] = amountsByToken[clause.transfer_token]
      ? amountsByToken[clause.transfer_token] + clause.transfer_amount
      : clause.transfer_amount
  })
  let toExchangeLabel
  let toLabel
  let fromExchangeLabel
  recipients.forEach(address => {
    if (KNOWN_ADDRESSES[address] && !toExchangeLabel) toExchangeLabel = KNOWN_ADDRESSES[address]
    else if (!toLabel) toLabel = formatAddress(address)
  })
  senders.forEach(address => {
    if (!fromExchangeLabel && KNOWN_ADDRESSES[address]) fromExchangeLabel = KNOWN_ADDRESSES[address]
  })
  let direction
  let label
  if (toExchangeLabel) {
    direction = 'to'
    label = toExchangeLabel
  } else if (fromExchangeLabel) {
    direction = 'from'
    label = fromExchangeLabel
  } else {
    direction = 'to'
    label = toLabel
  }

  let transfers = ''
  let justTokens = []
  Object.entries(amountsByToken).forEach(([token, amount]) => {
    const quantity = amount === 0 ? '< 1' : numeral(amount).format('0.0a')
    transfers += `${quantity} ${token}`
    justTokens.push(token)
  })
  if (justTokens.length > 1) transfers = justTokens.join(', ')

  return <Fragment>
    <TypeTag types={['Transfer']} clauses={clauses.length}/>
    {transfers}
    <div className="Transaction-subText">
      <div>
        {direction === 'to' && <span>
          <FontAwesomeIcon
            color="orange"
            icon={faArrowRight}
            size="13px"
          />&nbsp;
        </span>}
        {label}
        {direction === 'from' && <span>&nbsp;
          <FontAwesomeIcon
            color="green"
            icon={faArrowRight}
            size="13px"
          />
        </span>}
      </div>
    </div>
  </Fragment>
}

function DataTransaction({transaction, VTHOBurn, types}) {
  const clauses = transaction.clauses
  let contract = ''
  if (transaction.reverted) {
    types = 'Reverted'
    if (clauses.length > 0) contract = setContract(clauses)
    else contract = KNOWN_CONTRACTS[transaction.origin] || formatAddress(transaction.origin)
  } else {
    contract = setContract(clauses)
  }

  return <Fragment>
    <TypeTag types={types} clauses={clauses.length}/>
    {contract}
    <div className="Transaction-subText">
      {numberWithCommas(VTHOBurn)} Burn
    </div>
  </Fragment>
}

function setContract(clauses) {
  let contract
  clauses.forEach(clause => {
    if (!contract && KNOWN_CONTRACTS[clause.contract]) contract = KNOWN_CONTRACTS[clause.contract]
  })
  clauses.forEach(clause => {
    if (!contract && TOKEN_CONTRACTS[clause.contract]) contract = TOKEN_CONTRACTS[clause.contract]
  })
  if (!contract && clauses[0]) contract = formatAddress(clauses[0].contract)
  if (!contract && !clauses[0]) return 'No Clauses'
  return contract
}

function TypeTag({types, clauses}) {
  let className = 'Transaction-TypeTag'
  if (types.indexOf('Reverted') !== -1) className += ' Transaction-TypeTag-reverted'
  else if (types.indexOf('New Contract') !== -1) className += ' Transaction-TypeTag-newContract'
  else if (types.indexOf('Data') === -1) className += ' Transaction-TypeTag-transfer'
  else className += ' Transaction-TypeTag-data'
  return <div className={className}>
    {types}{clauses > 1 ? <span className="Transaction-TypeTag-clauses"> {clauses}</span> : ''}
  </div>
}

function updateStats({setStats, statsRef, transaction}) {
  statsRef.current = {
    ...statsRef.current,
    stats: {
      dailyVTHOBurn: statsRef.current.stats.dailyVTHOBurn + transaction.vthoBurn,
      dailyTransactions: statsRef.current.stats.dailyTransactions + 1,
      dailyClauses: statsRef.current.stats.dailyClauses + transaction.clauses.length,
    },
  }
  setStats(statsRef.current)
  document.title = `${numberWithCommas(statsRef.current.stats.dailyClauses)} Clauses | See VeChain`
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

function getBackgroundStyle({ transaction, size }) {
  const backgroundStyle = {
    width: `${size}px`,
    height: `${size}px`,
  }
  let background
  if (transaction.vthoBurn < 2000) {
    const colorIndex = getTransactionColorIndex(transaction.vthoBurn)
    const color = LIGHT_RANGE[Math.floor(colorIndex)]
    background = `linear-gradient(90deg, ${lightenDarkenColor(color, 40)}, ${lightenDarkenColor(color, -60)})`
  } else {
    background = `linear-gradient(#14ffe9, #ffeb3b, #ff00e0)`
    backgroundStyle.width = `${size + 2}px`
    backgroundStyle.height = `${size + 2}px`
  }
  backgroundStyle.background = background

  return backgroundStyle
}

function formatAddress(address) {
  return `${address.slice(2,6)}..${address.slice(-4)}`
}
