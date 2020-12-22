import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faVolumeUp,
  faVolumeOff,
  faChevronDown,
  faChevronRight,
  faChevronLeft,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons'

const typeToIconMap = {
  'volume-up': faVolumeUp,
  'volume-off': faVolumeOff,
  'down-chevron': faChevronDown,
  'right-chevron': faChevronRight,
  'left-chevron': faChevronLeft,
  'right-arrow': faArrowRight,
}

export default function Icon({
  className = '',
  type,
  size = 'sm',
  color = '#a1a1aa',
  ...props
}){
  return <FontAwesomeIcon {...{
    color,
    icon: typeToIconMap[type],
    size,
    className: `Icon ${className}`,
    ...props,
  }} />
}
