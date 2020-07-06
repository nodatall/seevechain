import { useState, useCallback } from 'preact/hooks'

export default function useForceUpdate(){
  const setState = useState()[1]
  return useCallback(() => { setState({}) }, [])
}
