import React from 'react'
import { useEffect, useState, useRef } from 'preact/hooks'
import { Suspense, lazy } from 'preact/compat'
import Cookies from 'js-cookie'
import ioClient from 'socket.io-client'
import moment from 'moment'
import { useLocalStorage } from 'lib/storageHooks'

import Transactions from 'components/Transactions'
import BottomBar from 'components/BottomBar'
import Spinner from 'components/Spinner'
import Stars from 'components/Stars'
import DonateModal from 'components/DonateModal'
import numberWithCommas from 'lib/numberWithCommas'
import { onReturnToStaleApp } from 'lib/onReturnToStaleApp'
import { locationToChartMap } from 'lib/chartHelpers'
import { PRETTY_KNOWN_CONTRACTS, KNOWN_ADDRESSES } from '../../../shared/knownAddresses'
import donate from 'assets/donate.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeUp, faVolumeOff, faStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons'
const StatsModal = lazy(() => import('components/StatsModal'))

import createUid from 'lib/createUid'
import './index.sass'

export default function Visualizer() {
  const [stats, setStats] = useState({})
  const [monthlyStats, setMonthlyStats] = useState()
  const [serverTime, setServerTime] = useState()
  const [controlsModalVisible, toggleDonateModalVisibility] = useState(false)
  const [statsModalVisible, toggleStatsModalVisibility] = useState(false)
  const [prices, setPrices] = useState()
  const [topContracts, setTopContracts] = useState()
  const [soundOn, setSoundOn] = useState(false)
  const initialized = useRef()
  const statsRef = useRef()
  const [starsHidden, setStarsHidden] = useLocalStorage('starsVisible')

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
      handleLatest({
        data,
        statsRef,
        initialized,
        setStats,
        setMonthlyStats,
        setServerTime,
        setPrices,
        setTopContracts,
      })
    })

    onReturnToStaleApp(
      () => {
        initialized.current = false
        socket.emit('clientAskForLatest', {
          seeVechainUid: Cookies.get('seeVechainUid'),
        })
      },
      10
    )

    if (locationToChartMap[window.location.pathname]) toggleStatsModalVisibility(true)
  }, [])

  if (!stats.block) return <div className="Visualizer">
    <Spinner />
  </div>

  return <div className="Visualizer">
    {!starsHidden && <Stars />}
    <div className="Visualizer-rightControls">
      <img
        className="Visualizer-rightControls-donateIcon"
        src={donate}
        onClick={() => { toggleDonateModalVisibility(!controlsModalVisible) }}
      />
      <FontAwesomeIcon
        color="#a1a1aa"
        icon={soundOn ? faVolumeUp : faVolumeOff}
        size="23px"
        onClick={() => { setSoundOn(!soundOn) }}
      />
      <FontAwesomeIcon
        color="#a1a1aa"
        icon={starsHidden ? emptyStar : faStar}
        size="23px"
        onClick={() => { setStarsHidden(!starsHidden) }}
      />
    </div>
    <BlockNumber stats={stats} />
    <BottomBar stats={stats.stats} toggleStatsModalVisibility={toggleStatsModalVisibility} />
    <Transactions
      transactions={stats.transactions}
      setStats={setStats}
      statsRef={statsRef}
      soundOn={soundOn}
    />
    <DonateModal open={controlsModalVisible} setVisibility={() => { toggleDonateModalVisibility(!controlsModalVisible) }} />
    {statsModalVisible && <Suspense fallback={<Spinner />}>
      <StatsModal
        open={statsModalVisible}
        setVisibility={() => { toggleStatsModalVisibility(!statsModalVisible) }}
        monthlyStats={monthlyStats}
        serverTime={serverTime}
        prices={prices}
        topContracts={topContracts}
      />
    </Suspense>
    }
  </div>
}

function BlockNumber({stats}) {
  const clausesInBlock = stats.transactions.reduce((clauses, tx) => clauses + tx.clauses.length, 0)
  return <a
    href={`https://insight.vecha.in/#/main/blocks/${stats.block.id}`}
    target="_blank"
    className="Visualizer-blockNumber"
  >
    {numberWithCommas(stats.block.number)} – {clausesInBlock} {clausesInBlock === 1 ? 'clause' : 'clauses'}
  </a>
}

function handleLatest({
  data, statsRef, initialized, setStats, setMonthlyStats, setServerTime, setPrices, setTopContracts,
}){
  if (!initialized.current) {
    const lessData = getStatsBeforeBatchOfTransactions(data)
    document.title = `${numberWithCommas(+lessData.stats.dailyClauses)} Clauses | See VeChain`
    initialized.current = true

    statsRef.current = lessData
    setStats(statsRef.current)
  } else {
    statsRef.current = {
      ...data,
      stats: statsRef.current.stats,
    }
    setStats(statsRef.current)
  }
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
  setTopContracts(data.topContracts)
  setServerTime(data.serverTime)
  setPrices(data.prices)
}

function getStatsBeforeBatchOfTransactions(data) {
  let dailyVTHOBurn = data.stats.dailyVTHOBurn
  let dailyTransactions = data.stats.dailyTransactions
  let dailyClauses = data.stats.dailyClauses

  data.transactions.forEach(transaction => {
    dailyTransactions -= 1
    dailyVTHOBurn -= transaction.vthoBurn
    dailyClauses -= transaction.clauses.length
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
  console.log('Contracts')
  console.table(PRETTY_KNOWN_CONTRACTS)
  console.log('Addresses')
  console.table(KNOWN_ADDRESSES)
}
