import React from 'react'
import { useEffect, useState } from 'preact/hooks'
import Div100vh from 'react-div-100vh'
import Cookies from 'js-cookie'
import ioClient from 'socket.io-client'

import Transactions from 'components/Transactions'
import BottomBar from 'components/BottomBar'
import Spinner from 'components/Spinner'
import Stars from 'components/Stars'
import DonateModal from 'components/DonateModal'
import numberWithCommas from 'lib/numberWithCommas'
import donate from 'assets/donate.png'
// import { getRandomTransactions } from 'lib/testData'

import './index.sass'

export default function Visualizer() {
  const [stats, setStats] = useState({})
  const [modalVisible, toggleModalVisibility] = useState(false)

  useEffect(() => {
    const vechainIdCookie = Cookies.get('seeVechainUid')
    if (!vechainIdCookie) {
      Cookies.set('seeVechainUid', createUid())
    }
    const socket = ioClient(window.origin.replace(/^(https|http)/, 'ws'))
    socket.emit('clientAskForLatest', {
      seeVechainUid: Cookies.get('seeVechainUid'),
    })
    socket.on('serverSendLatest', function(data) {
      // data.transactions = [
      //   ...data.transactions,
      //   ...getRandomTransactions(10),
      // ]
      setStats(data)
    })
  }, [])

  if (!stats.block) return <div className="Visualizer">
    <Spinner />
  </div>

  return <Div100vh className="Visualizer">
    <Stars />
    <img className="Visualizer-donate" src={donate} onClick={() => { toggleModalVisibility(!modalVisible) }} />
    <div className="Visualizer-blockNumber">Block: {numberWithCommas(stats.block.number)}</div>
    <BottomBar stats={stats.stats} />
    <Transactions transactions={stats.transactions} />
    <DonateModal open={modalVisible} toggleModalVisibility={() => { toggleModalVisibility(!modalVisible) }} />
  </Div100vh>
}

function createUid() {
  return (new Date().getUTCMilliseconds().toString() + new Date().getTime().toString()).toString()
    + Math.random().toString(36).substr(2, 9)
}
