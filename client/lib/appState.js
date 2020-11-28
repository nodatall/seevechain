import create from 'zustand'

const useAppState = create(set => ({
  topContracts: [],
  monthlyStats: [],
  serverTime: '',
  prices: {
    vet: { usd: 0 },
    vtho: { usd: 0 },
  },
  stats: {},
  usdVthoBurn: {},
  setTopContracts: topContracts => set(() => ({ topContracts })),
  setMonthlyStats: monthlyStats => set(() => ({ monthlyStats })),
  setServerTime: serverTime => set(() => ({ serverTime })),
  setPrices: prices => set(() => ({ prices })),
  setStats: stats => set(() => ({ stats })),
  setUsdVthoBurn: usdVthoBurn => set(() => ({ usdVthoBurn })),
}))

export default useAppState
