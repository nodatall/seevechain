import React from 'react'
import { useEffect, useState, useRef } from 'preact/hooks'
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
  const initialized = useRef()
  const statsRef = useRef()
  const hasTxStatsBeenCountedRef = useRef({})

  useEffect(() => {
    const vechainIdCookie = Cookies.get('seeVechainUid')
    if (!vechainIdCookie) {
      Cookies.set('seeVechainUid', createUid())
    }
    const socket = ioClient(window.origin.replace(/^http/, 'ws'))
    socket.emit('clientAskForLatest', {
      seeVechainUid: Cookies.get('seeVechainUid'),
    })
    socket.on('serverSendLatest', function(data) {
      handleLatest({ data, statsRef, initialized, setStats, hasTxStatsBeenCountedRef })
    })
  }, [])

  if (!stats.block) return <div className="Visualizer">
    <Spinner />
  </div>

  return <Div100vh className="Visualizer">
    <Stars />
    <img className="Visualizer-donate" src={donate} onClick={() => { toggleModalVisibility(!modalVisible) }} />
    <a href={`https://insight.vecha.in/#/main/blocks/${stats.block.id}`} target="_blank" className="Visualizer-blockNumber">
      Block: {numberWithCommas(stats.block.number)} – {stats.transactions.length} txs
    </a>
    <BottomBar stats={stats.stats} />
    <Transactions
      transactions={stats.transactions}
      setStats={setStats}
      statsRef={statsRef}
      hasTxStatsBeenCountedRef={hasTxStatsBeenCountedRef}
    />
    <DonateModal open={modalVisible} toggleModalVisibility={() => { toggleModalVisibility(!modalVisible) }} />
  </Div100vh>
}

function handleLatest({ data, statsRef, initialized, setStats, hasTxStatsBeenCountedRef }){
  data.transactions = [
    ...data.transactions,
    // ...getRandomTransactions(4),
  ]
  if (!initialized.current) {
    statsRef.current = data
    initialized.current = true
    setStats(getStatsBeforeBatchOfTransactions(data))
  } else {
    const lessData = getStatsBeforeBatchOfTransactions(data)
    const stats = lessData.stats
    for (const key in hasTxStatsBeenCountedRef.current) {
      const { vthoBurn, clauses } = hasTxStatsBeenCountedRef.current[key]
      stats.vthoBurn -= vthoBurn
      stats.clauses -= clauses
      stats.transactions -= 1
    }
    const newData = {
      ...lessData,
      stats,
    }
    statsRef.current = newData
    setStats(newData)
  }
}

function createUid() {
  return (new Date().getUTCMilliseconds().toString() + new Date().getTime().toString()).toString()
    + Math.random().toString(36).substr(2, 9)
}

function getStatsBeforeBatchOfTransactions(data) {
  let dailyVTHOBurn = data.stats.dailyVTHOBurn
  let dailyTransactions = data.stats.dailyTransactions
  let dailyClauses = data.stats.dailyClauses

  data.transactions.forEach(transaction => {
    dailyTransactions--
    dailyVTHOBurn -= transaction.vthoBurn
    dailyClauses -= transaction.clauses
  })

  return {
    ...data,
    stats: {
      dailyVTHOBurn,
      dailyTransactions,
      dailyClauses,
    }
  }
}
