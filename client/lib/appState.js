import create from 'zustand'

const useAppState = create(set => ({
  topContracts: [],
  dailyStats: [],
  serverTime: '',
  prices: {
    vet: { usd: 0 },
    vtho: { usd: 0 },
  },
  currentBlock: {},
  setTopContracts: topContracts => set(() => ({ topContracts })),
  setDailyStats: dailyStats => set(() => ({ dailyStats })),
  setServerTime: serverTime => set(() => ({ serverTime })),
  setPrices: prices => set(() => ({ prices })),
  setCurrentBlock: currentBlock => set(() => ({ currentBlock })),
}))

export default useAppState
