import React from 'react'
import { Fragment } from 'preact'

import { useEffect, useState, useRef } from 'preact/hooks'
import waitFor from 'delay'
import numeral from 'numeral'

import Icon from 'components/Icon'
import useAppState from 'lib/appState'
import numberWithCommas from 'lib/numberWithCommas'
import { getShortKnownContract, KNOWN_ADDRESSES, TOKEN_CONTRACTS } from '../../../shared/knownAddresses'
import lightenDarkenColor from 'lib/lightenDarkenColor'
import { LIGHT_RANGE, BOX_SHADOWS } from 'lib/colors'
import { highDing, lowDing } from 'lib/sounds'
import {
  calculateCoordinates,
  getTransactionColorIndex,
  getTransactionSize,
  randomNumber,
  getRangeEquivalent,
  COLOR_BURN_RANGE,
} from '../../lib/transactionHelpers'

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
  currentBlockRef,
  animationDuration,
  soundOn,
}) {
  const setCurrentBlock = useAppState(s => s.setCurrentBlock)
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
        if (VTHOBurn > 10) highDing.play()
        else lowDing.play()
      }
      const zIndex = txCount.count
      txCount.count += 1
      setForegroundStyle({
        ...defaultForegroundStyle,
        background: '#182024',
      })
      updateStats({setCurrentBlock, currentBlockRef, transaction})
      updateStyle(maxScale, { zIndex })
      await waitFor(secondDelay)
      updateStyle(maxScale, { transition: `transform 4s cubic-bezier(0.550, 0.085, 0.680, 0.530) both, opacity 300ms`, zIndex })
      await waitFor(thirdDelay)
      bubbleGrid.grid[row][col] = 0
      updateStyle(.7, { opacity: 0, zIndex })
      await waitFor(300)
      updateStyle(0, { transition: `transform 1ms cubic-bezier(0.550, 0.085, 0.680, 0.530) both, opacity 500ms`, opacity: 0 })
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
    onClick={() => { openInNewTab(`https://vechainstats.com/transaction/${transaction.id}/`) }}
  >
    <div className="Transaction-background" style={backgroundStyle} />
    <div className="Transaction-foreground" style={foregroundStyle}>
      {types.has('Transfer') && types.size === 1
        ? <TransferTransaction clauses={transaction.clauses} transaction={transaction} />
        : <DataTransaction transaction={transaction} VTHOBurn={VTHOBurn} types={[...types]} />
      }
    </div>
  </div>
}

function TransferTransaction({ clauses, transaction }) {
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

  const types = transaction.reverted ? 'Reverted' : 'Transfer'
  return <Fragment>
    <TypeTag types={types} clauses={clauses.length}/>
    {transfers}
    <div className="Transaction-subText">
      <div>
        {direction === 'to' && <span>
          <Icon color="orange" type="right-arrow" size="xs" />&nbsp;
        </span>}
        {label}
        {direction === 'from' && <span>&nbsp;
          <Icon color="green" type="right-arrow" size="xs" />
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
    else contract = getShortKnownContract(transaction.origin) || formatAddress(transaction.origin)
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
    const matchingKnownContract = getShortKnownContract(clause.contract)
    if (!contract && matchingKnownContract) contract = matchingKnownContract
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
  if (!types.length) types = 'Unknown'
  return <div className={className}>
    {types}{clauses > 1 ? <span className="Transaction-TypeTag-clauses"> {clauses}</span> : ''}
  </div>
}

function updateStats({setCurrentBlock, currentBlockRef, transaction}) {
  currentBlockRef.current = {
    ...currentBlockRef.current,
    dailyTotals: {
      dailyVTHOBurn: currentBlockRef.current.dailyTotals.dailyVTHOBurn + transaction.vthoBurn,
      dailyTransactions: currentBlockRef.current.dailyTotals.dailyTransactions + 1,
      dailyClauses: currentBlockRef.current.dailyTotals.dailyClauses + transaction.clauses.length,
    },
  }
  setCurrentBlock(currentBlockRef.current)
  document.title = `${numberWithCommas(currentBlockRef.current.dailyTotals.dailyClauses)} Clauses | See VeChain`
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
  const rotationSpeedRange = [1, 2]
  let rotationSpeed = getRangeEquivalent(COLOR_BURN_RANGE, rotationSpeedRange, transaction.vthoBurn)
  rotationSpeed = rotationSpeed < 1 ? 1 : rotationSpeed > 2 ? 2 : rotationSpeed
  const backgroundStyle = {
    width: `${size}px`,
    height: `${size}px`,
    animation: `spin ${Math.floor(6000 / rotationSpeed)}ms linear 0s infinite`,
  }
  let background
  if (transaction.vthoBurn < 20) {
    const colorIndex = getTransactionColorIndex(transaction.vthoBurn)
    const color = LIGHT_RANGE[Math.floor(colorIndex)]
    background = `linear-gradient(90deg, ${lightenDarkenColor(color, 40)}, ${lightenDarkenColor(color, -60)})`
  } else {
    background = `linear-gradient(#14ffe9, #ffeb3b, #ff00e0)`
    backgroundStyle.width = `${size + 2}px`
    backgroundStyle.height = `${size + 2}px`
    backgroundStyle.animationDirection = 'reverse'
  }
  backgroundStyle.background = background

  return backgroundStyle
}

function formatAddress(address) {
  return `${address.slice(2,6)}..${address.slice(-4)}`
}
