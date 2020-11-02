import React from 'react'
import { Fragment } from 'preact'
import { Suspense, lazy } from 'preact/compat'

import Visualizer from 'components/Visualizer'
import Spinner from 'components/Spinner'
import { Portal } from 'lib/portal'
const Analytics = lazy(() => import('components/Analytics'))

import './index.sass'

export default function Main() {
  if (window.location.pathname === '/analytics') {
    return <Suspense fallback={<div style={{height: '100%'}}><Spinner /></div>}>
      <Analytics />
    </Suspense>
  }
  return <Fragment>
    <Portal/>
    <Visualizer />
  </Fragment>
}
