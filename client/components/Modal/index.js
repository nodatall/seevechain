import React from 'react'
import { useRef } from 'preact/hooks'
import xIcon from 'assets/greyxicon.png'

import './index.sass'

export default function Modal({ open, setVisibility, children, className = '' }) {
  const shroud = useRef(null)
  function onShroudClick(event) {
    if (shroud.current === event.target) setVisibility()
  }

  let modal
  if (open) modal = <div className={`Modal ${className}`} ref={shroud} onMouseDOwn={onShroudClick}>
    <div className="Modal-window">
      <img src={xIcon} className="Modal-close" onClick={setVisibility} />
      {children}
    </div>
  </div>

  return modal
}
