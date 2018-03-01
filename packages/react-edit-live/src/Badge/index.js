import React from 'react'
import Modal, { open, close } from '../Modal/index'
import ModalContent from '../Modal/ModalContent'

const { styleUsable, singleView } = require('../utils')
const { use, unuse } = styleUsable(require('./style'))
const SingleModal = singleView({ className: 'i18n-modal-wrap' })(Modal)

export default class Badge extends React.Component {
  state = {
    hover: false,
    translationValue: ''
  }

  componentWillMount() {
    use()
  }

  componentWillUnmount() {
    // unuse()
  }

  onMouseEnter = evt => {
    this.setState({ hover: true })
  }
  onMouseLeave = evt => {
    this.setState({ hover: false })
  }

  handleClickEdit = evt => {
    open({
      children: (
        <ModalContent
          {...this.props}
          value={this.state.translationValue}
          updateValue={val => this.setState({ translationValue: val })}
        />
      )
    })

  }

  render() {
    const { id, raw, args, children } = this.props
    const { hover } = this.state

    return (
      <i18n
        className="i18n-badge"
        // data-key={id}
        // data-args={args}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {hover && <BadgeInner onClick={this.handleClickEdit}/>}
        {children ? children : raw}
      </i18n>
    )
  }
}

export const BadgeInner = ({ onClick }) => (
  <span className="i18n-badge-inner" onClick={onClick}/>
)
