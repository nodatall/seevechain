import React from 'react'
import { useCallback } from 'preact/hooks'
import PropTypes from 'prop-types'

import './index.sass'

export default function Checkbox(props){
  if ('value' in props && !('checked' in props)){
    props = {...props, checked: props.value}
    delete props.value
  }

  const onChange = useCallback(
    event => {
      if (props.onChange) props.onChange(event.target.checked)
    },
    [props.onChange],
  )

  const onKeyDown = event => {
    if (event.code === 'Space'){
      event.preventDefault()
      if (props.onChange) props.onChange(!props.checked)
      return false
    }
  }

  let className = 'Checkbox'
  if (props.checked) className += ' Checkbox-checked'
  if (props.reverse) className += ' Checkbox-reverse'

  return <label
    className={className}
    disabled={props.disabled}
  >
    <div
      className="Checkbox-pseudo-checkbox"
      tabIndex={props.disabled ? undefined : props.tabIndex}
      onKeyDown={onKeyDown}
    />
    <input
      type="checkbox"
      checked={!!props.checked}
      onChange={props.disabled ? undefined : onChange}
      disabled={props.disabled}
    />
    <span className="Checkbox-label">{props.label}</span>
  </label>
}

Checkbox.propTypes = {
  reverse: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.bool,
  checked: PropTypes.bool,
  label: PropTypes.node,
  onChange: PropTypes.func.isRequired,
  tabIndex: PropTypes.number,
}

Checkbox.defaultProps = {
  tabIndex: 0,
}
