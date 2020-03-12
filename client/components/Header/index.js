import React from 'react'

import './index.sass'

export default function Header({ children, size }) {
  const className = `Header Header-${size}`
  return <div className={className}>
    {children}
  </div>
}
