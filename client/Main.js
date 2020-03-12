import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'preact/hooks'
import Div100vh from 'react-div-100vh'

import Transactions from 'components/Transactions'
import BottomBar from 'components/BottomBar'
import Spinner from 'components/Spinner'
import Stars from 'components/Stars'
import DonateModal from 'components/DonateModal'
import calculateInterval from './lib/calculateInterval'
import numberWithCommas from './lib/numberWithCommas'
import donate from './assets/donate.png'
// import { TRANSACTIONS_SET_1, TRANSACTIONS_SET_2 } from './lib/testData'

import './index.sass'

let currentBlock

export default function Main() {
  const [block, setBlock] = useState()
  const [transactionsBlock1, setTransactionsBlock1] = useState()
  const [transactionsBlock2, setTransactionsBlock2] = useState()
  const [transactionsBlock3, setTransactionsBlock3] = useState()
  const [transactionsBlock4, setTransactionsBlock4] = useState()
  const [stats, setStats] = useState({})
  const [modalVisible, toggleModalVisibility] = useState(false)

  useEffect(() => {
    getLatest()
    setInterval(() => {
      getLatest()
    }, 7000)
  }, [])

  function getLatest() {
    return axios.get('/latest')
      .then(({data}) => {
        if (data.block.number !== currentBlock) {
          const { dailyClauses, dailyTransactions, dailyVTHOBurn } = data.stats
          const previousStats = { dailyClauses, dailyTransactions, dailyVTHOBurn }
          previousStats.dailyTransactions -= data.transactions.length
          data.transactions.forEach(transaction => {
            previousStats.dailyVTHOBurn -= +transaction.vthoBurn
            previousStats.dailyClauses -= +transaction.clauses
          })
          currentBlock = data.block.number
          setStats(previousStats)
          setBlock(data.block)
          setStatsOnIntervals(data.stats, setStats, data.transactions)
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

  if (!block) return <div className="Main">
    <Spinner />
  </div>

  return <Div100vh className="Main">
    <Stars />
    <img className="Main-donate" src={donate} onClick={() => { toggleModalVisibility(!modalVisible) }} />
    <div className="Main-blockNumber">Block: {numberWithCommas(block.number)}</div>
    <BottomBar stats={stats} />
    <Transactions transactions={transactionsBlock1} />
    <Transactions transactions={transactionsBlock2} />
    <Transactions transactions={transactionsBlock3} />
    <Transactions transactions={transactionsBlock4} />
    <DonateModal open={modalVisible} toggleModalVisibility={() => { toggleModalVisibility(!modalVisible) }} />
  </Div100vh>
}

function setStatsOnIntervals(stats, setStats, transactions) {
  stats = {
    dailyTransactions: stats.dailyTransactions - transactions.length,
    dailyClauses: stats.dailyClauses - transactions.reduce((acc, cur) => acc + +cur.clauses,0),
    dailyVTHOBurn: stats.dailyVTHOBurn - transactions.reduce((acc, cur) => acc + +cur.vthoBurn,0),
  }
  const interval = calculateInterval(transactions.length)
  let clauses = 0
  let vtho = 0
  for (let index = 0; index < transactions.length; index++) {
    const transaction = transactions[index]
    setTimeout(() => {
      clauses += +transaction.clauses
      vtho += +transaction.vthoBurn
      setStats({
        dailyTransactions: stats.dailyTransactions + index + 1,
        dailyClauses: stats.dailyClauses + clauses,
        dailyVTHOBurn:  stats.dailyVTHOBurn + vtho
      })
    }, (interval * (index + 1)) + 100)
  }
}
