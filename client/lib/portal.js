import React from 'react'
import { createPortal } from 'preact/compat'
import { useEffect, useRef } from 'preact/hooks'

let portalElement

export function Portal(){
  return <div ref={element => { portalElement = element }} />
}

export function usePortal(){
  const portalRef = useRef(global.document.createElement('div'))
  useEffect(
    () => {
      portalElement.appendChild(portalRef.current)
      return () => {
        portalElement.removeChild(portalRef.current)
      }
    },
    []
  )
  return element => createPortal(element, portalRef.current)
}
