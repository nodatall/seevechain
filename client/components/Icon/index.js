import React from 'react'

// https://material-ui.com/components/icons/
import VolumeMuteIcon from '@material-ui/icons/VolumeMute'
import VolumeUpIcon from '@material-ui/icons/VolumeUp'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import CloseIcon from '@material-ui/icons/Close'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import CheckIcon from '@material-ui/icons/Check'

import './index.sass'

const typeToIconMap = {
  'volume-up': VolumeUpIcon,
  'volume-off': VolumeMuteIcon,
  'down-chevron': KeyboardArrowDownIcon,
  'right-chevron': ChevronRightIcon,
  'left-chevron': ChevronLeftIcon,
  'right-arrow': ArrowForwardIcon,
  'close': CloseIcon,
  'copy': FileCopyIcon,
  'check': CheckIcon,
}

const sizeMap = {
  'xl': 40,
  'lg': 32,
  'md': 25,
  'sm': 20,
  'xs': 15,
}

export default function Icon({
  className = '',
  type,
  size = 'sm',
  color = '#a1a1aa',
  ...props
}){
  const Component = typeToIconMap[type]

  return <Component {...{
    style: { color, fontSize: sizeMap[size] },
    icon: typeToIconMap[type],
    className: `Icon ${className}`,
    ...props,
  }} />
}
