import React, { Component } from 'react'

import copyIcon from 'assets/copy_icon.png'
import greenCheck from 'assets/green_check.png'
import Clipboard from 'clipboard'

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
      {this.state.copied ? <img src={greenCheck} /> : <img src={copyIcon} />}
    </div>
  }
}
