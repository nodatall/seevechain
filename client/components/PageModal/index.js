import React from 'react'
import { Fragment } from 'preact'
import { useRef } from 'preact/hooks'
import { getVerticalScrollParent } from 'lib/DOMHelpers'

import useAppState from 'lib/appState'
import Modal from 'components/Modal'
import Icon from 'components/Icon'
import { setPathname } from 'lib/location'
import useToggle from 'lib/useToggleHook'
import CopyButton from 'components/CopyButton'
import Charts from 'components/Charts'
import QRCode from 'qrcode.react'

import './index.sass'

export default function PageModal({ setVisibility, open }) {
  const [donateVisible, showDonate, hideDonate, toggleDonate] = useToggle(false) // eslint-disable-line
  const donateRef = useRef()

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
    {open && <Charts />}
    <Donate {...{ toggleDonate, donateRef, donateVisible }} />
  </Modal>
}

function Donate({ toggleDonate, donateRef, donateVisible }) {
  return <Fragment>
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
  </Fragment>
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
