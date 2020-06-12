import React from 'react'
import loadable from '@loadable/component'

import Visualizer from 'components/Visualizer'
const Analytics = loadable(() => import('components/Analytics'))

import './index.sass'

export default function Main() {
  if (window.location.pathname === '/analytics') return <Analytics />
  return <Visualizer />
}
