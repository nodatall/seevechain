import React, { Component } from 'react'
import Clipboard from 'clipboard'

import Icon from 'components/Icon'

export default class CopyButton extends Component {
  componentDidMount() {
    this.clipboard = new Clipboard(this.copyButton, {
      text: () => {
        this.setState({copied: true})
        this.timeout = setTimeout(() => { this.setState({copied: false}) }, 1300)
        return this.props.copyValue
      }
    })
  }

  componentWillUnmount() {
    this.clipboard.destroy()
  }

  state = { copied: false }

  render() {
    return <div
      ref={button => { this.copyButton = button }}
      className="CopyButton"
    >
      <Icon
        type={this.state.copied ? 'check' : 'copy'}
        color={this.state.copied && 'green'}
      />
    </div>
  }
}
