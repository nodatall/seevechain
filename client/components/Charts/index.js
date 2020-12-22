import React from 'react'
import { useEffect } from 'preact/hooks'
import { useLocalStorage } from 'lib/storageHooks'

import Dropdown from 'components/Dropdown'
import { setPathname } from 'lib/location'
import { locationToChartMap } from 'lib/router'

import './index.sass'

export default function Charts({ forcePageUpdate }) {
  const [storedChartPath, setStoredChartPath] = useLocalStorage()
  let matchingChart = locationToChartMap[window.location.pathname]

  useEffect(() => {
    if (!matchingChart) {
      setPathname(storedChartPath || '/burn')
    }
    if (
      matchingChart &&
      window.location.pathname !== storedChartPath
    ) {
      setStoredChartPath(window.location.pathname)
    }
  }, [window.location.pathname])

  const CurrentChart = (
    matchingChart ||
    locationToChartMap[storedChartPath] ||
    locationToChartMap['/burn']
  ).component

  return <div className="Charts">
    <Dropdown {...{
      value: storedChartPath || '/burn',
      options: Object.keys(locationToChartMap).map(key => ({
        value: key,
        display: locationToChartMap[key].title,
      })),
      onChange: value => {
        setStoredChartPath(value)
        setPathname(value)
      },
      fullWidth: true,
    }} />
    {CurrentChart && <CurrentChart {...{forcePageUpdate}}/>}
  </div>
}
