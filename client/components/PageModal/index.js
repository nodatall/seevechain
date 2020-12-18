import React from 'react'
import { useEffect, useRef } from 'preact/hooks'
import { useLocalStorage } from 'lib/storageHooks'
import { getVerticalScrollParent } from 'lib/DOMHelpers'

import useAppState from 'lib/appState'
import Modal from 'components/Modal'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import { setPathname } from 'lib/location'
import { locationToChartMap } from 'lib/chartHelpers'
import useToggle from 'lib/useToggleHook'
import CopyButton from 'components/CopyButton'
import QRCode from 'qrcode.react'

import './index.sass'

export default function PageModal({ setVisibility, open }) {
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
    className: "PageModal",
  }}>
    <ServerTime />
    <Prices />
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
    {CurrentChart && <CurrentChart />}
    <div  {...{
      className: 'PageModal-donate',
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
      <Icon type={donateVisible ? 'down-chevron' : 'right-chevron'} />
    </div>
    {donateVisible &&
      <div className="PageModal-donateWrapper">
        <div className="PageModal-address">
          <input value="0x3f5929c5741C726Ea3fE574790ca89a69f6Aa780" />
          <CopyButton copyValue="0x3f5929c5741C726Ea3fE574790ca89a69f6Aa780" />
        </div>
        <div className="PageModal-currencyMessage">
          Send VET, VTHO, or any VIP180 token
        </div>
        <QRCode
          className="PageModal-qrCode"
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

function Prices() {
  const prices = useAppState(s => s.prices)
  return <div className="PageModal-prices">
    <span>
      VET
      <span className="PageModal-prices-price">${prices.vet.usd.toFixed(5)}</span>
    </span>
    <span className="PageModal-prices-middle">
      VTHO/VET
      <span className="PageModal-prices-price PageModal-prices-middle-price">
        {(prices.vtho.usd / prices.vet.usd).toFixed(4)}
      </span>
    </span>
    <span>
      VTHO
      <span className="PageModal-prices-price">${prices.vtho.usd.toFixed(5)}</span>
    </span>
  </div>
}

function ServerTime() {
  const serverTime = useAppState(s => s.serverTime)
  return <span className="PageModal-serverTime">
    Server time: {serverTime} (UTC+1)
  </span>
}
