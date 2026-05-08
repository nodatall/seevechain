import React from 'react'
import { useEffect, useRef } from 'preact/hooks'

import './index.sass'

const STAR_DENSITY_DESKTOP = .028
const STAR_DENSITY_MOBILE = .016
const STAR_SPEED = .06

export default function Stars() {
  const starsRef = useRef()
  const canvasRef = useRef()
  const rafRef = useRef()
  const resizeTimeoutRef = useRef()
  const starfieldRef = useRef(createStarfield())

  useEffect(
    () => {
      const starfield = starfieldRef.current
      setupStarfield({ starfield, starsRef, canvasRef })

      function animate() {
        drawStarfield(starfield)
        rafRef.current = requestAnimationFrame(animate)
      }

      function handleResize() {
        if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current)
        resizeTimeoutRef.current = setTimeout(() => {
          setupStarfield({ starfield, starsRef, canvasRef })
        }, 250)
      }

      rafRef.current = requestAnimationFrame(animate)
      window.addEventListener('resize', handleResize)

      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current)
        window.removeEventListener('resize', handleResize)
      }
    },
    []
  )

  return <div className="Stars" ref={starsRef}>
    <canvas className="Stars-canvas" ref={canvasRef}/>
  </div>
}

function createStarfield() {
  return {
    canvas: null,
    container: null,
    cw: 0,
    ch: 0,
    ctx: null,
    numStars: 0,
    stars: [],
    layers: [],
  }
}

function setupStarfield({ starfield, starsRef, canvasRef }){
  const canvas = canvasRef.current
  const container = starsRef.current
  if (!canvas || !container) return

  starfield.stars = []
  starfield.layers = []
  starfield.canvas = canvas
  starfield.container = container
  starfield.ctx = canvas.getContext('2d')
  starfield.cw = container.getBoundingClientRect().width
  starfield.ch = container.getBoundingClientRect().height

  canvas.width = starfield.cw
  canvas.height = starfield.ch

  const multiplier = window.innerWidth < 500 ? 3.2 : 6
  const starDensity = window.innerWidth < 500 ? STAR_DENSITY_MOBILE : STAR_DENSITY_DESKTOP
  const area = (starfield.cw * starfield.ch) / (multiplier * multiplier)
  starfield.numStars = area * starDensity

  const max = 3
  const med = 2
  const min = 1

  let starCount = 0

  while(starCount <= starfield.numStars) {
    let size = rand(1, 3)
    let count

    if (size == 1) {
      size = max
      count = 1
    } else if (size == 2) {
      size = med
      count = 20
    } else {
      size = min
      count = 80
    }
    createStar(starfield, size, count)
    starCount += count
  }

  for (let i = min; i <= max; i++) {
    const buffer = document.createElement('canvas')
    buffer.width = starfield.cw
    buffer.height = starfield.ch
    const bufferContext = buffer.getContext('2d')
    renderStars(starfield, i, bufferContext)
    starfield.layers.push({ y: 0, s: i, buffer })
  }
}

function createStar(starfield, size, numberToCreate) {
  for (let i = 0; i < numberToCreate; i++) {
    const x = rand(4, starfield.cw - 4)
    const y = rand(4, starfield.ch - 4)

    starfield.stars.push({
      x: x,
      y: y,
      s: size
    })
  }
}

function renderStars(starfield, size, bufferContext) {
  for (var i = 0; i < starfield.numStars; i++) {
    const star = starfield.stars[i]
    if (!star) continue
    if (star.s != size) continue

    let color
    // big star color
    if (star.s == 3){
      color = `rgba(${randomColor()}, ${rand(4, 7) / 10})`
    }
    // med star color
    if (star.s == 2){
      color = `rgba(${randomColor()}, ${rand(3, 6) / 10})`
    }
    // small star color
    if (star.s == 1){
      color = `rgba(${randomColor()}, ${rand(3, 5) / 10})`
    }

    bufferContext.beginPath()
    bufferContext.fillStyle = color
    bufferContext.fillRect(star.x, star.y, star.s, star.s)
    bufferContext.closePath()
    bufferContext.fill()
  }
}

function drawStarfield(starfield) {
  if (!starfield.ctx) return
  starfield.ctx.clearRect(0, 0, starfield.cw, starfield.ch)

  for (let i = 0; i < starfield.layers.length; i++) {
    const layer = starfield.layers[i]
    layer.x = 0
    layer.y = (layer.y * -1) >= starfield.ch ? 0 : layer.y - ((layer.s * 2) * STAR_SPEED)
    layer.y2 = layer.y + starfield.ch

    starfield.ctx.drawImage(layer.buffer, layer.x, layer.y)
    starfield.ctx.drawImage(layer.buffer, layer.x, layer.y2)
  }
}

function rand(from,to) {
  return Math.floor(Math.random() * (to - from + 1) + from)
}

function randomColor(){
  const min = 170
  const max = 255 - min
  const red = min + rand(0, max)
  const green = min + rand(0, max)
  const blue = min + rand(0, max)
  return `${red},${green},${blue}`
}
