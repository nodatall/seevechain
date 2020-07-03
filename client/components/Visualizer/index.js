import React from 'react'
import { useEffect, useState, useRef } from 'preact/hooks'
import Div100vh from 'react-div-100vh'
import Cookies from 'js-cookie'
import ioClient from 'socket.io-client'
import moment from 'moment'

import Transactions from 'components/Transactions'
import BottomBar from 'components/BottomBar'
import Spinner from 'components/Spinner'
import Stars from 'components/Stars'
import DonateModal from 'components/DonateModal'
import StatsModal from 'components/StatsModal'
import numberWithCommas from 'lib/numberWithCommas'
import KNOWN_ADDRESSES from 'lib/knownAddresses'
import donate from 'assets/donate.png'
// import { getRandomTransactions } from 'lib/testData'

import './index.sass'

export default function Visualizer() {
  const [stats, setStats] = useState({})
  const [monthlyStats, setMonthlyStats] = useState()
  const [serverTime, setServerTime] = useState()
  const [donateModalVisible, toggleDonateModalVisibility] = useState(false)
  const [statsModalVisible, toggleStatsModalVisibility] = useState(false)
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
    socket.emit('clientAskForWeekly', {
      seeVechainUid: Cookies.get('seeVechainUid'),
    })
    socket.on('serverSendLatest', function(data) {
      handleLatest({ data, statsRef, initialized, setStats, hasTxStatsBeenCountedRef, setMonthlyStats, setServerTime })
    })
  }, [])

  if (!stats.block) return <div className="Visualizer">
    <Spinner />
  </div>

  return <Div100vh className="Visualizer">
    <Stars />
    <img className="Visualizer-donate" src={donate} onClick={() => { toggleDonateModalVisibility(!donateModalVisible) }} />
    <BlockNumber stats={stats} />
    <BottomBar stats={stats.stats} toggleStatsModalVisibility={toggleStatsModalVisibility} />
    <Transactions
      transactions={stats.transactions}
      setStats={setStats}
      statsRef={statsRef}
      hasTxStatsBeenCountedRef={hasTxStatsBeenCountedRef}
    />
    <DonateModal open={donateModalVisible} setVisibility={() => { toggleDonateModalVisibility(!donateModalVisible) }} />
    <StatsModal
      open={statsModalVisible}
      setVisibility={() => { toggleStatsModalVisibility(!statsModalVisible) }}
      monthlyStats={monthlyStats}
      serverTime={serverTime}
    />
  </Div100vh>
}

function BlockNumber({stats}) {
  const clausesInBlock = stats.transactions.reduce((clauses, tx) => clauses + tx.clauses, 0)
  return <a
    href={`https://insight.vecha.in/#/main/blocks/${stats.block.id}`}
    target="_blank"
    className="Visualizer-blockNumber"
  >
    Block: {numberWithCommas(stats.block.number)} – {clausesInBlock} {clausesInBlock === 1 ? 'clause' : 'clauses'}
  </a>
}

function handleLatest({ data, statsRef, initialized, setStats, hasTxStatsBeenCountedRef, setMonthlyStats, setServerTime }){
  data.transactions = [
    ...data.transactions,
    // ...getRandomTransactions(4),
  ]
  const lessData = getStatsBeforeBatchOfTransactions(data)
  if (!initialized.current) {
    document.title = `${numberWithCommas(+lessData.stats.dailyClauses)} Clauses | See VeChain`
    initialized.current = true
  }
  const stats = lessData.stats
  for (const key in hasTxStatsBeenCountedRef.current) {
    const { vthoBurn, clauses } = hasTxStatsBeenCountedRef.current[key]
    stats.vthoBurn -= vthoBurn
    stats.clauses -= +clauses
    stats.transactions -= 1
  }
  const newData = {
    ...lessData,
    stats,
  }
  statsRef.current = newData
  setStats(newData)
  setMonthlyStats(
    [
      {
        day: moment(data.monthlyStats[0].day).add(24, 'hours').format('YYYY-MM-DD'),
        vthoBurn: Math.round(data.stats.dailyVTHOBurn),
        transactionCount: data.stats.dailyTransactions,
        clauseCount: data.stats.dailyClauses,
      },
      ...data.monthlyStats,
    ]
  )
  setServerTime(data.serverTime)
}

function createUid() {
  return (new Date().getUTCMilliseconds().toString() + new Date().getTime().toString()).toString()
    + Math.random().toString(36).substr(2, 9)
}

function getStatsBeforeBatchOfTransactions(data) {
  let dailyVTHOBurn = data.stats.dailyVTHOBurn
  let dailyTransactions = data.stats.dailyTransactions
  let dailyClauses = +data.stats.dailyClauses

  data.transactions.forEach(transaction => {
    dailyTransactions -= 1
    dailyVTHOBurn -= transaction.vthoBurn
    dailyClauses -= +transaction.clauses
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

console.info('To see a list of labelled addresses, type `getFriendlyNames()` in the console below.')
window.getFriendlyNames = printFriendlyNames

function printFriendlyNames() {
  console.table(KNOWN_ADDRESSES)
}
