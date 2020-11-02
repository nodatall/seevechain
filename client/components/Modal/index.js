import React from 'react'
import { useRef } from 'preact/hooks'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import xIcon from 'assets/greyxicon.png'
import { usePortal } from 'lib/portal'

import './index.sass'

export default function Modal({ open, setVisibility, children, className = '' }) {
  const renderInPortal = usePortal()

  const shroud = useRef(null)
  function onShroudClick(event) {
    if (shroud.current === event.target) setVisibility()
  }

  let modal
  if (open) modal = <CSSTransition
    timeout={300}
    classNames="Modal-animation"
  >
    <div className={`Modal ${className}`} ref={shroud} onClick={onShroudClick}>
      <div className="Modal-window">
        <div className="Modal-window-body">
          <img src={xIcon} className="Modal-close" onClick={setVisibility} />
          {children}
        </div>
      </div>
    </div>
  </CSSTransition>

  return renderInPortal(
    <TransitionGroup component="span">{modal}</TransitionGroup>
  )
}
