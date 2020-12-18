import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeUp, faVolumeOff } from '@fortawesome/free-solid-svg-icons'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

const typeToIconMap = {
  'volume-up': faVolumeUp,
  'volume-off': faVolumeOff,
  'down-chevron': faChevronDown,
  'right-chevron': faChevronRight,
  'right-arrow': faArrowRight,
}

export default function Icon({
  className,
  type,
  size = 'sm',
  color = '#a1a1aa',
  ...props
}){
  return <FontAwesomeIcon {...{
    color,
    icon: typeToIconMap[type],
    size,
    className,
    ...props,
  }} />
}
