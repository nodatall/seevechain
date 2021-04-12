import React from 'react'
import { useEffect, useState, useRef } from 'preact/hooks'
import { Suspense, lazy } from 'preact/compat'
import Cookies from 'js-cookie'
import ioClient from 'socket.io-client'
import moment from 'moment'

import useAppState from 'lib/appState'
import numberWithCommas from 'lib/numberWithCommas'
import { onReturnToStaleApp } from 'lib/onReturnToStaleApp'
import { allRoutes, } from 'lib/router'
import createUid from 'lib/createUid'
import useWindowEventListener from 'lib/useWindowEventListenerHook'

import Transactions from 'components/Transactions'
import BottomBar from 'components/BottomBar'
import Spinner from 'components/Spinner'
import Stars from 'components/Stars'
import Icon from 'components/Icon'
const PageModal = lazy(() => import('components/PageModal'))
import { PRETTY_KNOWN_CONTRACTS, KNOWN_ADDRESSES } from '../../../shared/knownAddresses'

import './index.sass'

export default function Visualizer() {
  const setTopContracts = useAppState(s => s.setTopContracts)
  const [pageModalVisible, togglePageModalVisibility] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const initialized = useRef()
  const currentBlockRef = useRef()

  useEffect(() => {
    const vechainIdCookie = Cookies.get('seeVechainUid')
    if (!vechainIdCookie) {
      Cookies.set('seeVechainUid', createUid())
    }
    const socket = ioClient(process.env.ORIGIN || window.origin)
    socket.emit('clientAskForLatest', {
      seeVechainUid: Cookies.get('seeVechainUid'),
    })
    socket.emit('clientAskForWeekly', {
      seeVechainUid: Cookies.get('seeVechainUid'),
    })
    socket.on('serverSendLatest', function(data) {
      handleLatest({ data, currentBlockRef, initialized })
      setLoaded(true)
    })
    socket.on('serverSendTopContracts', function(data) {
      if (!data) return
      setTopContracts(data.topContracts)
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

    if (allRoutes.includes(window.location.pathname)) togglePageModalVisibility(true)
  }, [])

  useWindowEventListener('popstate', () => {
    if (allRoutes.includes(window.location.pathname)) togglePageModalVisibility(true)
  })

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
    <Transactions currentBlockRef={currentBlockRef} soundOn={soundOn}
    />
  </div>
}

function BlockNumber() {
  const currentBlock = useAppState(s => s.currentBlock)
  const clausesInBlock = currentBlock.transactions.reduce((clauses, tx) => clauses + tx.clauses.length, 0)
  return <a
    href={`https://insight.vecha.in/#/main/blocks/${currentBlock.block.id}`}
    target="_blank"
    className="Visualizer-blockNumber"
  >
    {numberWithCommas(currentBlock.block.number)} – {clausesInBlock} {clausesInBlock === 1 ? 'clause' : 'clauses'}
  </a>
}

function handleLatest({ data, currentBlockRef, initialized }){
  if (!data) return
  const setDailyStats = useAppState(s => s.setDailyStats)
  const setServerTime = useAppState(s => s.setServerTime)
  const setPrices = useAppState(s => s.setPrices)
  const setCurrentBlock = useAppState(s => s.setCurrentBlock)

  if (!initialized.current) {
    const lessData = getStatsBeforeBatchOfTransactions(data)
    document.title = `${numberWithCommas(+lessData.dailyTotals.dailyClauses)} Clauses | See VeChain`
    initialized.current = true

    currentBlockRef.current = lessData
    setCurrentBlock(currentBlockRef.current)
  } else {
    currentBlockRef.current = {
      ...data,
      dailyTotals: currentBlockRef.current.dailyTotals,
    }
    setCurrentBlock(currentBlockRef.current)
  }
  setDailyStats(
    [
      {
        day: moment(data.dailyStats[0].day).add(24, 'hours').format('YYYY-MM-DD'),
        vthoBurn: Math.round(data.dailyTotals.dailyVTHOBurn),
        transactionCount: data.dailyTotals.dailyTransactions,
        clauseCount: data.dailyTotals.dailyClauses,
      },
      ...data.dailyStats,
    ]
  )
  setServerTime(data.serverTime)
  setPrices(data.prices)
}

function getStatsBeforeBatchOfTransactions(data) {
  let dailyVTHOBurn = data.dailyTotals.dailyVTHOBurn
  let dailyTransactions = data.dailyTotals.dailyTransactions
  let dailyClauses = data.dailyTotals.dailyClauses

  data.transactions.forEach(transaction => {
    dailyTransactions -= 1
    dailyVTHOBurn -= transaction.vthoBurn
    dailyClauses -= transaction.clauses.length
  })

  return {
    ...data,
    dailyTotals: {
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
