import React from 'react'
import { useRef, useEffect } from 'preact/hooks'
import loadable from '@loadable/component'

import qrCode from 'assets/donate_qr_code.jpg'
import xIcon from 'assets/greyxicon.png'
import Header from 'components/Header'
const CopyButton = loadable(() => import('components/CopyButton'))
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import './index.sass'

export default function DonateModal({ toggleModalVisibility, open }) {
  useEffect(() => {
    [qrCode, xIcon].forEach(imageSrc => {
      const image = new Image()
      image.src = imageSrc
    })
  }, [])

  const shroud = useRef(null)
  function onShroudClick(event) {
    if (shroud.current === event.target) toggleModalVisibility()
  }

  const xIconImage = <img src={xIcon} className="DonateModal-close" onClick={toggleModalVisibility} />
  const qrCodeImage = <img className="DonateModal-qrCode" src={qrCode} />

  let modal
  if (open) modal = <CSSTransition
    timeout={300}
    classNames="DonateModal-animation"
  >
    <div className="DonateModal" ref={shroud} onClick={onShroudClick}>
      <div className="DonateModal-window">
        {xIconImage}
        <Header size="md">Donate</Header>
        <div>
          Contributions will keep this site running and fund the development of additional awesome VeChain apps. Thank you!
        </div>
        <div className="DonateModal-currencyMessage">
          VET, VTHO, or any VIP180 address:
        </div>
        {qrCodeImage}
        <div className="DonateModal-address">
          <input value="0x80F7FCd03083B520DC8FF2C04dbEe5697aBe2c1a" />
          <CopyButton copyValue="0x80F7FCd03083B520DC8FF2C04dbEe5697aBe2c1a" />
        </div>
        <div className="DonateModal-currencyMessage">
          Nano address:
        </div>
        <div className="DonateModal-address">
          <input value="nano_3ojkidrf5ejakg38i51metphfzxicndkh576564nx4pz6ambtnab8ozq5mcu" />
          <CopyButton copyValue="nano_3ojkidrf5ejakg38i51metphfzxicndkh576564nx4pz6ambtnab8ozq5mcu" />
        </div>
        <div className="DonateModal-currencyMessage">
          BTC address:
        </div>
        <div className="DonateModal-address">
          <input value="bc1qsvk80cavejvgg2a20ts2z5r8sl2wcj3qu8pl2g" />
          <CopyButton copyValue="bc1qsvk80cavejvgg2a20ts2z5r8sl2wcj3qu8pl2g" />
        </div>
        <div className="DonateModal-currencyMessage">
          ETH address:
        </div>
        <div className="DonateModal-address">
          <input value="0x4EA62672bDE98e84dBe93Dc2858A3D3D4e36CF90" />
          <CopyButton copyValue="0x4EA62672bDE98e84dBe93Dc2858A3D3D4e36CF90" />
        </div>
      </div>
    </div>
  </CSSTransition>

  return <TransitionGroup component="span">{modal}</TransitionGroup>
}
