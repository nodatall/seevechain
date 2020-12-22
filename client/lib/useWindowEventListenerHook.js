import { useEffect } from 'preact/hooks'

export default function useWindowEventListenerHook(listener, handler) {
  useEffect(() => {
    window.addEventListener(listener, handler)
    return () => { window.removeEventListener(listener, handler)}
  }, [])
}
