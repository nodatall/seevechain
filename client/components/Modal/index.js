import React from 'react'
import { useRef } from 'preact/hooks'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import xIcon from 'assets/greyxicon.png'

import './index.sass'

export default function Modal({ open, toggleVisibility, children }) {
  const shroud = useRef(null)
  function onShroudClick(event) {
    if (shroud.current === event.target) toggleVisibility()
  }

  let modal
  if (open) modal = <CSSTransition
    timeout={300}
    classNames="Modal-animation"
  >
    <div className="Modal" ref={shroud} onClick={onShroudClick}>
      <div className="Modal-window">
        <img src={xIcon} className="Modal-close" onClick={toggleVisibility} />
        {children}
      </div>
    </div>
  </CSSTransition>

  return <TransitionGroup component="span">{modal}</TransitionGroup>
}
