import create from 'zustand'

const useAppState = create(set => ({
  topContracts: [],
  dailyStats: [],
  serverTime: '',
  prices: {
    vet: { usd: 0 },
    vtho: { usd: 0 },
  },
  stats: {},
  usdVthoBurn: {},
  setTopContracts: topContracts => set(() => ({ topContracts })),
  setDailyStats: dailyStats => set(() => ({ dailyStats })),
  setServerTime: serverTime => set(() => ({ serverTime })),
  setPrices: prices => set(() => ({ prices })),
  setStats: stats => set(() => ({ stats })),
  setUsdVthoBurn: usdVthoBurn => set(() => ({ usdVthoBurn })),
}))

export default useAppState
