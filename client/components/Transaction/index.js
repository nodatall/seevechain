import React from 'react'
import { useEffect, useMemo } from 'preact/hooks'

import lightenDarkenColor from 'lib/lightenDarkenColor'
import { LIGHT_RANGE } from 'lib/colors'
import {
  calculateCoordinates,
} from '../../lib/transactionHelpers'

import './index.sass'

const bubbleGrid = {
  windowHeight: 0,
  windowWidth: 0,
  grid: [],
}

const MOBILE_RATIO = .7
const TRADE_SIZE_RANGE = [78, 138]
const VISUAL_NOTIONAL_RANGE = [10, 100000]

export default function Transaction({
  transaction,
  animationDuration,
}) {
  const trade = transaction
  const delay = trade.delay || 0
  const visualNotional = getVisualNotional(trade)
  const size = getTradeSize(visualNotional)
  const backgroundStyle = getBackgroundStyle({ notional: visualNotional, size })
  const placement = useMemo(() => getTradePlacement({ size, delay }), [size, delay])
  const foregroundStyle = {
    width: `${size - 3}px`,
    height: `${size - 3}px`,
  }

  useEffect(() => {
    document.title = `${trade.coin} ${formatCurrency(visualNotional)} | Hypersight`
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
    title={`${trade.coin} ${side} ${formatCurrency(visualNotional)} at ${formatPrice(trade.price)}`}
  >
    <div className="Transaction-background" style={backgroundStyle} />
    <div className="Transaction-foreground" style={foregroundStyle}>
      <TypeTag side={side} />
      <div className="Transaction-primaryText">
        <span>{trade.coin}</span>
        <strong>{formatCurrency(visualNotional)}</strong>
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
  const low = Math.log10(VISUAL_NOTIONAL_RANGE[0] + 10)
  const high = Math.log10(VISUAL_NOTIONAL_RANGE[1] + 10)
  const ratio = (adjusted - low) / (high - low)
  const size = TRADE_SIZE_RANGE[0] + ((TRADE_SIZE_RANGE[1] - TRADE_SIZE_RANGE[0]) * ratio)

  return Math.floor(Math.max(TRADE_SIZE_RANGE[0], Math.min(TRADE_SIZE_RANGE[1], size)))
}

function getAnimationSeconds(animationDuration) {
  const duration = (animationDuration || []).reduce((total, value) => total + Number(value || 0), 9000)
  return Math.max(5.5, Math.min(9, duration / 1000))
}

function getBackgroundStyle({ notional, size }) {
  const value = Math.max(0, Number(notional || 0))
  const rotationSpeedRange = [1, 2]
  const notionalRatio = getLogRatio(value, VISUAL_NOTIONAL_RANGE)
  const rotationSpeed = rotationSpeedRange[0] + ((rotationSpeedRange[1] - rotationSpeedRange[0]) * notionalRatio)
  const color = getTradeColor(value)
  const brightColor = lightenDarkenColor(color, 40)
  const darkColor = lightenDarkenColor(color, -60)

  const backgroundStyle = {
    width: `${size}px`,
    height: `${size}px`,
    animation: `spin ${Math.floor(6000 / rotationSpeed)}ms linear 0s infinite`,
    boxShadow: `0 0 ${Math.round(size * .16)}px ${Math.round(size * .06)}px ${hexToRgba(color, .48)}, 0 0 ${Math.round(size * .45)}px ${Math.round(size * .18)}px ${hexToRgba(color, .16)}, 0 0 2px 1px rgba(255, 255, 255, .55)`,
  }

  if (value < VISUAL_NOTIONAL_RANGE[1]) {
    backgroundStyle.background = `linear-gradient(90deg, ${brightColor}, ${darkColor})`
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

function getTradeColor(notional) {
  const ratio = getLogRatio(notional, VISUAL_NOTIONAL_RANGE)
  const index = Math.round(ratio * (LIGHT_RANGE.length - 1))
  return LIGHT_RANGE[Math.max(0, Math.min(LIGHT_RANGE.length - 1, index))]
}

function getVisualNotional(trade) {
  const price = Number(trade.price || 0)
  const size = Number(trade.size || 0)
  const computedNotional = price * size

  if (Number.isFinite(computedNotional) && computedNotional > 0) return computedNotional

  const notional = Number(trade.notional || 0)
  return Number.isFinite(notional) ? notional : 0
}

function getLogRatio(value, range) {
  const safeValue = Math.max(0, Number(value || 0))
  const low = Math.log10(range[0] + 10)
  const high = Math.log10(range[1] + 10)
  const adjusted = Math.log10(safeValue + 10)
  const ratio = (adjusted - low) / (high - low)
  return Math.max(0, Math.min(1, ratio))
}

function hexToRgba(hex, alpha) {
  const value = hex.replace('#', '')
  const red = parseInt(value.slice(0, 2), 16)
  const green = parseInt(value.slice(2, 4), 16)
  const blue = parseInt(value.slice(4, 6), 16)
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
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
