import React from 'react'

import useAppState from 'lib/appState'
import { colorSet, colorSet2 } from 'lib/chartHelpers'
import {
  getGroupsAndFilteredContractsFromTopContracts,
  onContractClick,
  getLabels,
} from 'lib/topContractHelpers'

import Spinner from 'components/Spinner'
import BarChart from 'components/BarChart'

import './index.sass'

export default function TopContractsChart({ forcePageUpdate }) {
  const topContracts = useAppState(s => s.topContracts)
  if (!topContracts.length) return <div className="TopContractsCharts"><Spinner /></div>

  const { groups, filteredContracts } = getGroupsAndFilteredContractsFromTopContracts(topContracts)

  const sortedByVtho = [...filteredContracts].sort((a, b) => b.vthoBurn - a.vthoBurn).slice(0, 20)
  const burnData = {
    labels: getLabels(sortedByVtho, 'vthoBurn'),
    datasets: [{
      label: 'VTHO Burn by Contract',
      backgroundColor: colorSet,
      data: sortedByVtho.map(contract => contract.vthoBurn),
    }]
  }

  const sortedByClauses = [...filteredContracts].sort((a, b) => b.clauses - a.clauses).slice(0, 20)
  const clausesData = {
    labels: getLabels(sortedByClauses, 'clauses'),
    datasets: [{
      label: 'Clauses by Contract',
      backgroundColor: colorSet2,
      data: sortedByClauses.map(contract => contract.clauses),
    }]
  }

  return <div className="TopContractsCharts">
    <div
      className="TopContractsCharts-chart"
      onClick={onContractClick({ contracts: sortedByVtho, groups, forcePageUpdate })}
    >
      <BarChart {...{ data: burnData }}/>
    </div>
    <div
      className="TopContractsCharts-chart"
      onClick={onContractClick({ contracts: sortedByClauses, groups, forcePageUpdate })}
    >
      <BarChart {...{ data: clausesData }}/>
    </div>
  </div>
}
