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
  const [transactionsBlock1, setTransactionsBlock1] = useState()
  const [transactionsBlock2, setTransactionsBlock2] = useState()
  const [transactionsBlock3, setTransactionsBlock3] = useState()
  const [transactionsBlock4, setTransactionsBlock4] = useState()
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
    }, 7000)
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
          //   ...getRandomTransactions(),
          // ]
          if (data.block.number % 4 === 1) {
            setTransactionsBlock1(data.transactions)
          } else if (data.block.number % 4 === 2) {
            setTransactionsBlock2(data.transactions)
          } else if (data.block.number % 4 === 3) {
            setTransactionsBlock3(data.transactions)
          } else {
            setTransactionsBlock4(data.transactions)
          }
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
    <Transactions transactions={transactionsBlock1} />
    <Transactions transactions={transactionsBlock2} />
    <Transactions transactions={transactionsBlock3} />
    <Transactions transactions={transactionsBlock4} />
    <DonateModal open={modalVisible} toggleModalVisibility={() => { toggleModalVisibility(!modalVisible) }} />
  </Div100vh>
}

function createUid() {
  return (new Date().getUTCMilliseconds().toString() + new Date().getTime().toString()).toString()
    + Math.random().toString(36).substr(2, 9)
}
