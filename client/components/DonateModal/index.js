import React from 'react'

import qrCode from 'assets/donate_qr_code.jpg'
import Header from 'components/Header'
import CopyButton from 'components/CopyButton'
import Modal from 'components/Modal'

import './index.sass'

export default function DonateModal({ setVisibility, open }) {

  return <Modal open={open} setVisibility={setVisibility} className="DonateModal">
    <Header size="md">Donate</Header>
    <div>
      Contributions will keep this site running and fund the development of additional awesome VeChain apps. Thank you!
    </div>
    <img className="DonateModal-qrCode" src={qrCode} />
    <div className="DonateModal-currencyMessage">
      VET, VTHO, or any VIP180 address:
    </div>
    <div className="DonateModal-address">
      <input value="0x80F7FCd03083B520DC8FF2C04dbEe5697aBe2c1a" />
      <CopyButton copyValue="0x80F7FCd03083B520DC8FF2C04dbEe5697aBe2c1a" />
    </div>
  </Modal>
}
