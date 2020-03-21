import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'preact/hooks'
import Div100vh from 'react-div-100vh'
import Cookies from 'js-cookie'

import Transactions from 'components/Transactions'
import BottomBar from 'components/BottomBar'
import Spinner from 'components/Spinner'
import Stars from 'components/Stars'
import DonateModal from 'components/DonateModal'
import numberWithCommas from 'lib/numberWithCommas'
import donate from 'assets/donate.png'
// import { getRandomTransactions } from 'lib/testData'

import './index.sass'

let currentBlock

export default function Visualizer() {
  const [block, setBlock] = useState()
  const [transactions, setTransactions] = useState()
  const [stats, setStats] = useState({})
  const [modalVisible, toggleModalVisibility] = useState(false)

  useEffect(() => {
    const vechainIdCookie = Cookies.get('seeVechainUid')
    if (!vechainIdCookie) {
      Cookies.set('seeVechainUid', createUid())
    }

    getLatest()
    setInterval(() => {
      getLatest()
    }, 1000)
  }, [])

  function getLatest() {
    return axios.get('/api/latest')
      .then(({data}) => {
        if (data.block.number !== currentBlock) {
          currentBlock = data.block.number
          setStats(data.stats)
          setBlock(data.block)
          // data.transactions = [
          //   ...data.transactions,
          //   ...getRandomTransactions(20),
          // ]
          setTransactions(data.transactions)
        }
      })
  }

  if (!block) return <div className="Visualizer">
    <Spinner />
  </div>

  return <Div100vh className="Visualizer">
    <Stars />
    <img className="Visualizer-donate" src={donate} onClick={() => { toggleModalVisibility(!modalVisible) }} />
    <div className="Visualizer-blockNumber">Block: {numberWithCommas(block.number)}</div>
    <BottomBar stats={stats} />
    <Transactions transactions={transactions} />
    <DonateModal open={modalVisible} toggleModalVisibility={() => { toggleModalVisibility(!modalVisible) }} />
  </Div100vh>
}

function createUid() {
  return (new Date().getUTCMilliseconds().toString() + new Date().getTime().toString()).toString()
    + Math.random().toString(36).substr(2, 9)
}
