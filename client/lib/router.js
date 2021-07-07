import BurnTxsAndClausesCharts from 'components/BurnTxsAndClausesCharts'
import TopContractsChart from 'components/TopContractsChart'
import BurnMovingAverageChart from 'components/BurnMovingAverageChart'
import UsdVthoBurnChart from 'components/UsdVthoBurnChart'
import { contractGroupings } from 'lib/contractGroupings'

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

export const locationToGroupMap = {}
for (let key in contractGroupings) {
  locationToGroupMap[`/${key.toLowerCase().replace(/ /g, '-')}`] = key
}

export const allRoutes = [
  ...Object.keys(locationToChartMap),
  ...Object.keys(locationToGroupMap),
]
