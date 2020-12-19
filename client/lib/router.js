import BurnTxsAndClausesCharts from 'components/BurnTxsAndClausesCharts'
import TopContractsChart from 'components/TopContractsChart'
import BurnMovingAverageChart from 'components/BurnMovingAverageChart'
import UsdVthoBurnChart from 'components/UsdVthoBurnChart'
import { invertedContractGroupings, contractGroupings } from 'lib/contractGroupings'

export const locationToChartMap = {
  '/contracts': {
    title: 'Today\'s Top Contracts',
    component: TopContractsChart,
  },
  '/burn': {
    title: 'VTHO Burn, Clauses & Txs',
    component: BurnTxsAndClausesCharts,
  },
  '/burn-moving-averages': {
    title: 'VTHO Burn Moving Averages',
    component: BurnMovingAverageChart,
  },
  '/burn-usd': {
    title: 'USD VTHO Burn',
    component: UsdVthoBurnChart,
  }
}

console.log(`contractGroupings -->`, contractGroupings)
export const locationToGroupMap = {}
