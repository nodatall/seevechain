import { useState, useCallback } from 'preact/hooks'

export default function useToggle(initialValue = false){
  const [value, setValue] = useState(initialValue)
  const open = useCallback(() => setValue(true), [])
  const close = useCallback(() => setValue(false), [])
  const toggle = useCallback(() => setValue(!value), [value])
  return [value, open, close, toggle]
}
