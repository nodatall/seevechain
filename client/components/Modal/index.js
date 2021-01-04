import React from 'react'
import { useRef } from 'preact/hooks'

import Icon from 'components/Icon'

import './index.sass'

export default function Modal({ open, setVisibility, children, className = '' }) {
  const shroud = useRef(null)
  function onShroudClick(event) {
    if (shroud.current === event.target) setVisibility()
  }

  let modal
  if (open) modal = <div className={`Modal ${className}`} ref={shroud} onMouseDOwn={onShroudClick}>
    <div className="Modal-window">
      <Icon size="lg" type='close' className="Modal-close" />
      {children}
    </div>
  </div>

  return modal
}
