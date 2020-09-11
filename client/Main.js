import React from 'react'
import { Suspense, lazy } from 'preact/compat'

import Visualizer from 'components/Visualizer'
import Spinner from 'components/Spinner'
const Analytics = lazy(() => import('components/Analytics'))

import './index.sass'

export default function Main() {
  if (window.location.pathname === '/analytics') {
    return <Suspense fallback={<div style={{height: '100vh'}}><Spinner /></div>}>
      <Analytics />
    </Suspense>
  }
  return <Visualizer />
}
