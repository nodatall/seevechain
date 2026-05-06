import React from 'react'
import { useEffect, useMemo } from 'preact/hooks'

import lightenDarkenColor from 'lib/lightenDarkenColor'
import { LIGHT_RANGE } from 'lib/colors'
import {
  calculateCoordinates,
  getRangeEquivalent,
} from '../../lib/transactionHelpers'

import './index.sass'

const bubbleGrid = {
  windowHeight: 0,
  windowWidth: 0,
  grid: [],
}

const MOBILE_RATIO = .7
const TRADE_SIZE_RANGE = [78, 138]
const TRADE_NOTIONAL_RANGE = [1000, 1500000]

export default function Transaction({
  transaction,
  animationDuration,
}) {
  const trade = transaction
  const delay = trade.delay || 0
  const size = getTradeSize(trade.notional)
  const backgroundStyle = getBackgroundStyle({ trade, size })
  const placement = useMemo(() => getTradePlacement({ size, delay }), [size, delay])
  const foregroundStyle = {
    width: `${size - 3}px`,
    height: `${size - 3}px`,
  }

  useEffect(() => {
    document.title = `${trade.coin} ${formatCurrency(trade.notional)} | Hypersight`
    const releaseTimeout = setTimeout(() => {
      releaseGridPosition(placement.row, placement.col)
    }, (getAnimationSeconds(animationDuration) * 1000) + delay)

    return () => {
      clearTimeout(releaseTimeout)
      releaseGridPosition(placement.row, placement.col)
    }
  }, [])

  const side = trade.side === 'sell' ? 'Sell' : 'Buy'
  const animationSeconds = getAnimationSeconds(animationDuration)

  return <div
    className="Transaction"
    style={{
      ...placement.style,
      animation: `tradeBubble ${animationSeconds}s ease-out ${delay}ms both`,
    }}
    title={`${trade.coin} ${side} ${formatCurrency(trade.notional)} at ${formatPrice(trade.price)}`}
  >
    <div className="Transaction-background" style={backgroundStyle} />
    <div className="Transaction-foreground" style={foregroundStyle}>
      <TypeTag side={side} />
      <div className="Transaction-primaryText">
        <span>{trade.coin}</span>
        <strong>{formatCurrency(trade.notional)}</strong>
      </div>
      <div className="Transaction-subText">
        {formatPrice(trade.price)}
        <span>{formatSize(trade.size)}</span>
      </div>
    </div>
  </div>
}

function getTradePlacement({ size, delay }) {
  const isMobile = window.innerWidth <= 760
  const bottomBarHeight = (document.querySelector('.BottomBar') || {}).clientHeight || 0
  const { xCoordinate, yCoordinate, row, col } = calculateCoordinates({
    size,
    bottomBarHeight,
    isMobile,
    bubbleGrid,
    mobileRatio: MOBILE_RATIO,
  })

  return {
    row,
    col,
    style: {
      width: `${size}px`,
      height: `${size}px`,
      zIndex: getStableZIndex(delay),
      transform: `translate(${xCoordinate}px, ${yCoordinate}px) scale(0) perspective(1px) translate3d(0,0,0)`,
      '--trade-x': `${xCoordinate}px`,
      '--trade-y': `${yCoordinate}px`,
      '--trade-scale': isMobile ? MOBILE_RATIO : 1,
    },
  }
}

function releaseGridPosition(row, col) {
  if (bubbleGrid.grid[row] && bubbleGrid.grid[row][col]) bubbleGrid.grid[row][col] = 0
}

function TypeTag({ side }) {
  const sideClass = side === 'Sell'
    ? 'Transaction-TypeTag-reverted'
    : 'Transaction-TypeTag-transfer'

  return <div className={`Transaction-TypeTag ${sideClass}`}>
    {side}
  </div>
}

function getTradeSize(notional) {
  const value = Math.max(0, Number(notional || 0))
  const adjusted = Math.log10(value + 10)
  const low = Math.log10(TRADE_NOTIONAL_RANGE[0] + 10)
  const high = Math.log10(TRADE_NOTIONAL_RANGE[1] + 10)
  const ratio = (adjusted - low) / (high - low)
  const size = TRADE_SIZE_RANGE[0] + ((TRADE_SIZE_RANGE[1] - TRADE_SIZE_RANGE[0]) * ratio)

  return Math.floor(Math.max(TRADE_SIZE_RANGE[0], Math.min(TRADE_SIZE_RANGE[1], size)))
}

function getAnimationSeconds(animationDuration) {
  const duration = (animationDuration || []).reduce((total, value) => total + Number(value || 0), 9000)
  return Math.max(5.5, Math.min(9, duration / 1000))
}

function getBackgroundStyle({ trade, size }) {
  const value = Math.max(0, Number(trade.notional || 0))
  const rotationSpeedRange = [1, 2]
  let rotationSpeed = getRangeEquivalent(TRADE_NOTIONAL_RANGE, rotationSpeedRange, value)
  rotationSpeed = rotationSpeed < 1 ? 1 : rotationSpeed > 2 ? 2 : rotationSpeed

  const backgroundStyle = {
    width: `${size}px`,
    height: `${size}px`,
    animation: `spin ${Math.floor(6000 / rotationSpeed)}ms linear 0s infinite`,
  }

  if (value < TRADE_NOTIONAL_RANGE[1]) {
    const colorIndex = getTradeColorIndex(value)
    const color = LIGHT_RANGE[Math.floor(colorIndex)]
    backgroundStyle.background = `linear-gradient(90deg, ${lightenDarkenColor(color, 40)}, ${lightenDarkenColor(color, -60)})`
  } else {
    backgroundStyle.background = 'linear-gradient(#14ffe9, #ffeb3b, #ff00e0)'
    backgroundStyle.width = `${size + 2}px`
    backgroundStyle.height = `${size + 2}px`
    backgroundStyle.animationDirection = 'reverse'
  }

  return backgroundStyle
}

function getStableZIndex(delay) {
  return 10 + Math.floor(Number(delay || 0))
}

function getTradeColorIndex(notional) {
  const colorRange = [0, LIGHT_RANGE.length - 1]
  let colorIndex = getRangeEquivalent(TRADE_NOTIONAL_RANGE, colorRange, notional)
  if (colorIndex < 0) colorIndex = 0
  if (colorIndex > LIGHT_RANGE.length - 1) colorIndex = LIGHT_RANGE.length - 1
  return colorIndex
}

function formatPrice(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return '$0'
  return number.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: number >= 100 ? 2 : 4,
  })
}

function formatCurrency(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return '$0'
  return number.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  })
}

function formatSize(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return '0'
  return number.toLocaleString(undefined, {
    maximumFractionDigits: 4,
  })
}
