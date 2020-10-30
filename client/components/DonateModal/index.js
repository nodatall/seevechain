import React from 'react'

import Header from 'components/Header'
import CopyButton from 'components/CopyButton'
import Modal from 'components/Modal'
import QRCode from 'qrcode.react'

import './index.sass'

export default function DonateModal({ setVisibility, open }) {

  return <Modal open={open} setVisibility={setVisibility} className="DonateModal">
    <Header size="md">Donate</Header>
    <div>
      Contributions will keep this site running and fund the development of additional awesome VeChain apps. Thank you!
    </div>
    <QRCode
      className="DonateModal-qrCode"
      value="0x3f5929c5741C726Ea3fE574790ca89a69f6Aa780"
      size={128}
      bgColor="#ffffff"
      fgColor="#182024"
      level="L"
      includeMargin={false}
      renderAs="svg"
    />
    <div className="DonateModal-currencyMessage">
      VET, VTHO, or any VIP180 address:
    </div>
    <div className="DonateModal-address">
      <input value="0x3f5929c5741C726Ea3fE574790ca89a69f6Aa780" />
      <CopyButton copyValue="0x3f5929c5741C726Ea3fE574790ca89a69f6Aa780" />
    </div>
  </Modal>
}
