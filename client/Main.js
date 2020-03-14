import React from 'react'

import Visualizer from 'components/Visualizer'
import Analytics from 'components/Analytics'

import './index.sass'

export default function Main() {
  if (window.location.pathname === '/analytics') return <Analytics />
  return <Visualizer />
}
