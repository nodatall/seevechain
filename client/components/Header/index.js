import React from 'react'

import './index.sass'

export default function Header({ children, size = 'md'}) {
  const className = `Header Header-${size}`
  return <div className={className}>
    {children}
  </div>
}
