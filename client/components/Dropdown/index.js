import React, { Component } from 'react'

import './index.sass'

export default class Dropdown extends Component {
  static defaultProps = {
    noOptions: 'no options',
    fullWidth: false,
  }

  getOptionsArray(){
    return Array.isArray(this.props.options)
      ? this.props.options
      : Object.keys(this.props.options)
  }

  getValuesArray(){
    return Array.isArray(this.props.options)
      ? this.props.options
      : Object.values(this.props.options)
  }

  onChange = event => {
    const { disabled, options } = this.props
    if (disabled) return

    const newValue = Array.isArray(options)
      ? event.target.value
      : options[event.target.value]
    this.props.onChange(newValue)
  }

  render() {
    const {
      disabled,
      placeholder,
      value,
      defaultValue,
      fullWidth,
      noOptions,
      tabIndex,
      noIcon,
      postMessage,
      ...props
    } = this.props
    delete props.options

    let className = 'Dropdown'
    if (disabled) className += ' Dropdown-disabled'
    if (fullWidth) className += ' Dropdown-fullWidth'
    if (this.props.className) className += ` ${this.props.className}`
    if (noIcon) className += ' Dropdown-noIcon'

    const options = this.getOptionsArray()
    const optionsList = options.map(option => {
      const value = option.value ? option.value : option
      const display = option.display ? option.display : option
      return <option value={value} label={display}>{display}</option>
    })

    if (
      placeholder || (
        (typeof value === 'undefined' || value === null) &&
        !this.getValuesArray().includes(value)
      )
    ) {
      optionsList.unshift(<option value="" disabled selected={!value} label={placeholder}>{placeholder}</option>)
    }
    if (options.length === 0) {
      optionsList.push(<option value="" disabled label={noOptions}>{noOptions}</option>)
    }
    if (postMessage) {
      optionsList.push(<option value="" disabled label={postMessage}>{postMessage}</option>)
    }

    let currentValue
    if (!Array.isArray(this.props.options)) {
      const match = Object.entries(this.props.options).find(([, v]) => v === value)
      if (match) currentValue = match[0]
    }else{
      currentValue = value
    }

    return <select
      {...props}
      value={currentValue || defaultValue}
      onChange={this.onChange}
      className={className}
      disabled={disabled}
      tabIndex={tabIndex}
    >
      {optionsList}
    </select>
  }
}
