import create from 'zustand'

const useAppState = create(set => ({
  topContracts: [],
  monthlyStats: [],
  setTopContracts: topContracts => set(() => ({ topContracts })),
  setMonthlyStats: monthlyStats => set(() => ({ monthlyStats })),
}))

export default useAppState
