import { LIGHT_RANGE } from './colors'

const MAX_TRANSACTION_SIZE = 115

export function calculateCoordinates({size, bottomBarHeight, isMobile, bubbleGrid, mobileRatio}) {
  const windowHeight = window.innerHeight - bottomBarHeight
  const windowWidth = window.innerWidth
  const transactionSize = isMobile ? MAX_TRANSACTION_SIZE * .7 : MAX_TRANSACTION_SIZE

  const TARGET_REMAINDER = 25
  function calculateColNum(divider = transactionSize) {
    const tmpColNum = windowWidth / divider
    if (getRemainder(windowWidth, tmpColNum) < TARGET_REMAINDER) return calculateColNum(divider + 10)
    else return tmpColNum
  }
  function calculateRowNum(divider = transactionSize) {
    const tmpRowNum = windowHeight / divider
    if (getRemainder(windowHeight, tmpRowNum) < TARGET_REMAINDER) return calculateRowNum(divider + 10)
    else return tmpRowNum
  }

  const colNum = calculateColNum()
  const rowNum = calculateRowNum()
  if (windowHeight !== bubbleGrid.windowHeight || windowWidth !== bubbleGrid.windowWidth) {
    bubbleGrid.windowHeight = windowHeight
    bubbleGrid.windowWidth = windowWidth
    bubbleGrid.grid = Array(Math.floor(rowNum)).fill().map(() =>
      Array(Math.floor(colNum)).fill().map(() => 0)
    )
  }

  const openSpots = []
  bubbleGrid.grid.forEach((row, rowIndex) => {
    bubbleGrid.grid[rowIndex].forEach((col, colIndex) => {
      if (!col) openSpots.push([rowIndex, colIndex])
    })
  })

  let row
  let col
  if (openSpots.length === 0) {
    row = randomNumber(0, rowNum)
    col = randomNumber(0, colNum)
  } else {
    const spot = openSpots[randomNumber(0, openSpots.length - 1)]
    row = spot[0]
    col = spot[1]
    bubbleGrid.grid[row][col] += 1
  }

  const extraIfTxIsSmall = transactionSize - (size * (isMobile ? mobileRatio : 1))

  const xRemainder = getRemainder(windowWidth, colNum)
  const colRemainder = xRemainder * col
  const baseX = num => (((windowWidth / colNum) * num) - (windowWidth / 2))
  const startX = baseX(col)
    - extraIfTxIsSmall
    + colRemainder
    + (isMobile ? transactionSize * 1.22 : transactionSize)
  const endX = baseX(col + 1)
    + colRemainder
    - transactionSize
    + xRemainder
    + (isMobile ? transactionSize * 1.15 : transactionSize)
  const xCoordinate = Math.floor(randomNumber(startX, endX))

  const yRemainder = getRemainder(windowHeight, rowNum)
  const rowRemainder = yRemainder * row
  const baseY = num => (((windowHeight / rowNum) * num) - (windowHeight / 2))
  const startY = baseY(row)
    + rowRemainder
    - (isMobile ? 30 : 15)
  const endY = baseY(row + 1)
    + rowRemainder
    - transactionSize
    + extraIfTxIsSmall
  const yCoordinate = Math.floor(randomNumber(startY, endY))

  return {
    xCoordinate,
    yCoordinate,
    row,
    col,
  }
}

function getRemainder(distance, gridLocation) {
  return (distance / Math.floor(gridLocation)) - (distance / gridLocation)
}

export function randomNumber(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

export function getTransactionSize(burn) {
  const TRANSACTION_VTHO_BURN_RANGE = [14, 1000]
  const TRANSACTION_SIZE_RANGE = [95, MAX_TRANSACTION_SIZE]
  let size = getRangeEquivalent(TRANSACTION_VTHO_BURN_RANGE, TRANSACTION_SIZE_RANGE, burn)
  if (size < TRANSACTION_SIZE_RANGE[0]) size = TRANSACTION_SIZE_RANGE[0]
  if (size > TRANSACTION_SIZE_RANGE[1]) size = TRANSACTION_SIZE_RANGE[1]
  return Math.floor(size)
}

export function getTransactionColorIndex(burn) {
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
