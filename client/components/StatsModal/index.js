import React from 'react'
import { useEffect } from 'preact/hooks'
import { useLocalStorage } from 'lib/storageHooks'

import Modal from 'components/Modal'
import Dropdown from 'components/Dropdown'
import Spinner from 'components/Spinner'
import { setPathname } from 'lib/location'
import { locationToChartMap } from 'lib/chartHelpers'

import './index.sass'

export default function StatsModal({ setVisibility, open, monthlyStats, serverTime, prices, topContracts }) {
  const [storedChartPath, setStoredChartPath] = useLocalStorage()

  const matchingChart = locationToChartMap[window.location.pathname]
  useEffect(() => {
    if (open && !matchingChart) {
      setPathname(storedChartPath || '/burn')
    }
    if (
      open &&
      matchingChart &&
      window.location.pathname !== storedChartPath
    ) {
      setStoredChartPath(window.location.pathname)
    }
  }, [open, window.location.pathname, storedChartPath])

  const CurrentChart = (matchingChart || {}).component
  return <Modal open={open} setVisibility={setVisibility} className="StatsModal">
    <span className="StatsModal-serverTime">
      Server time: {serverTime} (UTC+2)
    </span>
    <div className="StatsModal-prices">
      <span>
        VET
        <span className="StatsModal-prices-price">${prices.vet.usd.toFixed(5)}</span>
      </span>
      <span>
        VTHO
        <span className="StatsModal-prices-price">${prices.vtho.usd.toFixed(5)}</span>
      </span>
    </div>
    <Dropdown {...{
      value: window.location.pathname,
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
    {CurrentChart && <CurrentChart {...{ monthlyStats, topContracts }} />}
    {!CurrentChart && <Spinner />}
  </Modal>
}
