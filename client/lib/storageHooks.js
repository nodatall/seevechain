import { useEffect, useCallback } from 'preact/hooks'
import useForceUpdate from 'lib/useForceUpdateHook'

function useStorage(storage, key){
  const forceUpdate = useForceUpdate()

  const value = key in storage ? safeJSONParse(storage, key) : undefined

  const setValue = useCallback(
    value => {
      if (typeof value === 'undefined') {
        if (typeof storage[key] === 'undefined') return
        delete storage[key]
      }else{
        value = JSON.stringify(value)
        if (storage[key] === value) return
        storage[key] = value
      }
      forceUpdate()
    },
    [storage, key]
  )

  useEffect(
    () => {
      const onChange = event => {
        if (event.storageArea === storage && event.key === key)
          forceUpdate()
      }
      global.addEventListener('storage', onChange)
      return () => {
        global.removeEventListener('storage', onChange)
      }
    },
    [storage, key],
  )

  return [value, setValue]
}

export function useLocalStorage(...args){
  return useStorage(global.localStorage, ...args)
}

export function useSessionStorage(...args){
  return useStorage(global.sessionStorage, ...args)
}

function safeJSONParse(storage, key){
  try{
    return JSON.parse(storage[key])
  }catch(error){
    console.warn('useStorage hook failed to parse storage key as json', {key, value: storage[key]})
    return undefined
  }
}
