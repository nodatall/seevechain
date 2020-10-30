import React from 'react'
import { useEffect, useRef } from 'preact/hooks'
import { useLocalStorage } from 'lib/storageHooks'
import { getVerticalScrollParent } from 'lib/DOMHelpers'

import Modal from 'components/Modal'
import Dropdown from 'components/Dropdown'
import { setPathname } from 'lib/location'
import { locationToChartMap } from 'lib/chartHelpers'
import useToggle from 'lib/useToggleHook'
import CopyButton from 'components/CopyButton'
import QRCode from 'qrcode.react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'

import './index.sass'

export default function StatsModal({ setVisibility, open, monthlyStats, serverTime, prices, topContracts }) {
  const [storedChartPath, setStoredChartPath] = useLocalStorage()
  const [donateVisible, showDonate, hideDonate, toggleDonate] = useToggle(false) // eslint-disable-line
  const donateRef = useRef()

  let matchingChart = locationToChartMap[window.location.pathname]
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
  }, [open, window.location.pathname])

  const CurrentChart = (
    matchingChart ||
    locationToChartMap[storedChartPath] ||
    locationToChartMap['/burn']
  ).component

  return <Modal {...{
    open,
    setVisibility: value => {
      if (open) setPathname('/')
      setVisibility(value)
    },
    className: "StatsModal",
  }}>
    <span className="StatsModal-serverTime">
      Server time: {serverTime} (UTC+1)
    </span>
    <div className="StatsModal-prices">
      <span>
        VET
        <span className="StatsModal-prices-price">${prices.vet.usd.toFixed(5)}</span>
      </span>
      <span className="StatsModal-prices-middle">
        VTHO/VET
        <span className="StatsModal-prices-price StatsModal-prices-middle-price">{(prices.vtho.usd / prices.vet.usd).toFixed(3)}</span>
      </span>
      <span>
        VTHO
        <span className="StatsModal-prices-price">${prices.vtho.usd.toFixed(5)}</span>
      </span>
    </div>
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
    {CurrentChart && <CurrentChart {...{ monthlyStats, topContracts }} />}
    <div  {...{
      className: 'StatsModal-donate',
      ref: donateRef,
      onClick: () => {
        toggleDonate()
        window.setTimeout(
          () => {
            if (!donateVisible && donateRef.current) {
              const scrollParent = getVerticalScrollParent(donateRef.current)
              scrollParent.scrollTop = scrollParent.scrollHeight
            }
          },
          0
        )
      },
    }} >
      Support Seevechain&nbsp;
      <FontAwesomeIcon
        color="#a1a1aa"
        icon={donateVisible ? faChevronDown : faChevronRight}
        size="sm"
      />
    </div>
    {donateVisible &&
      <div className="StatsModal-donateWrapper">
        <div className="StatsModal-address">
          <input value="0x3f5929c5741C726Ea3fE574790ca89a69f6Aa780" />
          <CopyButton copyValue="0x3f5929c5741C726Ea3fE574790ca89a69f6Aa780" />
        </div>
        <div className="StatsModal-currencyMessage">
          Send VET, VTHO, or any VIP180 token
        </div>
        <QRCode
          className="StatsModal-qrCode"
          value="0x3f5929c5741C726Ea3fE574790ca89a69f6Aa780"
          size={128}
          bgColor="#ffffff"
          fgColor="#182024"
          level="L"
          includeMargin={false}
          renderAs="svg"
        />
      </div>
    }
  </Modal>
}
