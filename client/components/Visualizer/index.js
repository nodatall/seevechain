import React from 'react'
import { useEffect, useState, useRef } from 'preact/hooks'
import { Suspense, lazy } from 'preact/compat'
import Cookies from 'js-cookie'
import ioClient from 'socket.io-client'
import moment from 'moment'

import useAppState from 'lib/appState'
import Transactions from 'components/Transactions'
import BottomBar from 'components/BottomBar'
import Spinner from 'components/Spinner'
import Stars from 'components/Stars'
import Icon from 'components/Icon'
import numberWithCommas from 'lib/numberWithCommas'
import { onReturnToStaleApp } from 'lib/onReturnToStaleApp'
import { locationToChartMap } from 'lib/chartHelpers'
import { PRETTY_KNOWN_CONTRACTS, KNOWN_ADDRESSES } from '../../../shared/knownAddresses'
const PageModal = lazy(() => import('components/PageModal'))

import createUid from 'lib/createUid'
import './index.sass'

export default function Visualizer() {
  const setTopContracts = useAppState(s => s.setTopContracts)
  const setUsdVthoBurn = useAppState(s => s.setUsdVthoBurn)
  const [pageModalVisible, togglePageModalVisibility] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const initialized = useRef()
  const statsRef = useRef()

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
      handleLatest({ data, statsRef, initialized })
      setLoaded(true)
    })
    socket.on('serverSendTopContracts', function(data) {
      if (!data) return
      setTopContracts(data.topContracts)
    })
    socket.on('serverSendUsdVthoBurn', function(data) {
      if (!data) return
      setUsdVthoBurn(data)
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

    if (locationToChartMap[window.location.pathname]) togglePageModalVisibility(true)
  }, [])

  if (!loaded) return <div className="Visualizer">
    <Spinner />
  </div>

  return <div className="Visualizer">
    {pageModalVisible && <Suspense fallback={<Spinner />}>
      <PageModal
        open={pageModalVisible}
        setVisibility={() => { togglePageModalVisibility(!pageModalVisible) }}
      />
    </Suspense>
    }
    <Stars />
    <div className="Visualizer-rightControls">
      <Icon type={soundOn ? 'volume-up' : 'volume-off'} size="md" onClick={() => { setSoundOn(!soundOn) }} />
    </div>
    <BlockNumber />
    <BottomBar togglePageModalVisibility={togglePageModalVisibility} />
    <Transactions statsRef={statsRef} soundOn={soundOn}
    />
  </div>
}

function BlockNumber() {
  const stats = useAppState(s => s.stats)
  const clausesInBlock = stats.transactions.reduce((clauses, tx) => clauses + tx.clauses.length, 0)
  return <a
    href={`https://insight.vecha.in/#/main/blocks/${stats.block.id}`}
    target="_blank"
    className="Visualizer-blockNumber"
  >
    {numberWithCommas(stats.block.number)} – {clausesInBlock} {clausesInBlock === 1 ? 'clause' : 'clauses'}
  </a>
}

function handleLatest({ data, statsRef, initialized }){
  if (!data) return
  const setDailyStats = useAppState(s => s.setDailyStats)
  const setServerTime = useAppState(s => s.setServerTime)
  const setPrices = useAppState(s => s.setPrices)
  const setStats = useAppState(s => s.setStats)

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
  setDailyStats(
    [
      {
        day: moment(data.dailyStats[0].day).add(24, 'hours').format('YYYY-MM-DD'),
        vthoBurn: Math.round(data.stats.dailyVTHOBurn),
        transactionCount: data.stats.dailyTransactions,
        clauseCount: data.stats.dailyClauses,
      },
      ...data.dailyStats,
    ]
  )
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
