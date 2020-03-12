import React from 'react'

import qrCode from 'assets/donate_qr_code.png'
import Header from 'components/Header'
import CopyButton from 'components/CopyButton'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import './index.sass'

export default function DonateModal({ toggleModalVisibility, open }) {
  let modal
  if (open) modal = <CSSTransition
    timeout={300}
    classNames="DonateModal-animation"
  >
    <div className="DonateModal">
      <div className="DonateModal-window">
        <div className="DonateModal-close" onClick={toggleModalVisibility}>x</div>
        <Header size="md">Donate</Header>
        <div>
          Contributions will keep this site running and fund the development of additional awesome VeChain apps. Thank you!
        </div>
        <img className="DonateModal-qrCode" src={qrCode} />
        <div>
          Send VET, VTHO, or any VIP180 token to:
        </div>
        <div className="DonateModal-address">
          <input value="0x80F7FCd03083B520DC8FF2C04dbEe5697aBe2c1a" />
          <CopyButton copyValue="0x80F7FCd03083B520DC8FF2C04dbEe5697aBe2c1a" />
        </div>
      </div>
    </div>
  </CSSTransition>

  return <TransitionGroup component="span">{modal}</TransitionGroup>
}
