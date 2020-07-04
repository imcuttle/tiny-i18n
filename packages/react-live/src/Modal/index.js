import React from 'react'

const {
  styleUsable,
  isElementOf,
  createSingleElementView
} = require('../utils')
const { use, unuse } = styleUsable(require('./style'))

const prefix = 'i18n-modal-'

const emitter = createSingleElementView()
function downHandle(evt) {
  if (evt.target.classList.contains('i18n-modal-header')) {
    // const x = evt.clientX - evt.offsetX - 1
    // const y = evt.clientY - evt.offsetY - 1
    const { left, top } = this.getBoundingClientRect()
    this.style.left = left + 'px'
    this.style.top = top + 'px'
    this.style.marginLeft = '0px'
    this.style.transform = 'none'

    this.pos = {
      x: evt.clientX || evt.touches[0].clientX,
      y: evt.clientY || evt.touches[0].clientY
    }
  }
}
function moveHandle(evt) {
  if (evt.buttons || evt.type === 'touchmove') {
    if (this.pos /*evt.target.classList.contains('i18n-modal-header')*/) {
      const clientX = evt.clientX || evt.touches[0].clientX
      const clientY = evt.clientY || evt.touches[0].clientY
      const dx = clientX - this.pos.x
      const dy = clientY - this.pos.y
      this.pos = { x: clientX, y: clientY }

      const { left, top } = this.getBoundingClientRect()
      this.style.left = left + dx + 'px'
      this.style.top = top + dy + 'px'
    }
  } else {
    this.pos = null
  }
}

export const Header = ({ children, onClose /*onMinimize*/ }) => (
  <div className={prefix + 'header'}>
    {children}
    <div className={prefix + 'header-buttons'}>
      <span onClick={onClose} title={'Ctrl/Cmd + ]'} className={prefix + 'header-btn close-btn'}>
        ×
      </span>
    </div>
  </div>
)

export const Body = ({ children }) => (
  <div className={prefix + 'body'}>{children}</div>
)

export const Sep = ({ color, style }) => (
  <div
    className={prefix + 'sep'}
    style={{ backgroundColor: color, ...style }}
  />
)

export const Footer = ({ children }) => (
  <div className={prefix + 'footer'}>{children}</div>
)

export default class Modal extends React.PureComponent {
  componentWillMount() {
    use()
  }

  componentWillUnmount() {
    unuse()
  }

  getSort(ele) {
    let value = 0
    if (isElementOf(Header)(ele)) {
      value = -1
    } else if (isElementOf(Body)(ele)) {
      value = 0
    } else if (isElementOf(Footer)(ele)) {
      value = 1
    }
    return value
  }

  render() {
    const { visible, onClose } = this.props
    const children = React.Children.toArray(this.props.children).sort(
      (a, b) => {
        return this.getSort(a) - this.getSort(b)
      }
    )

    if (!visible) {
      return null
    }

    return (
      <div className={prefix + 'container'}>
        {children.map(child => {
          if (isElementOf(Header)(child) && onClose) {
            return React.cloneElement(child, { onClose })
          }
          return child
        })}
      </div>
    )
  }
}

Modal.Header = Header
Modal.Body = Body
Modal.Footer = Footer
Modal.Sep = Sep

Object.assign(Modal, emitter, {
  open(props, attributes, mountDOM) {
    // element, attributes, mountDOM = document.body
    let dom = emitter.open(
      <Modal onClose={emitter.close} {...props} visible={true} />,
      { ...attributes, className: prefix + 'wrap' },
      mountDOM
    )

    document.body.removeEventListener('mousemove', emitter.moveHandle)
    document.body.removeEventListener('mousedown', emitter.downHandle)

    document.body.removeEventListener('touchstart', emitter.downHandle)
    document.body.removeEventListener('touchmove', emitter.moveHandle)

    emitter.moveHandle = moveHandle.bind(dom)
    emitter.downHandle = downHandle.bind(dom)
    document.body.addEventListener('mousemove', emitter.moveHandle)
    document.body.addEventListener('mousedown', emitter.downHandle)
    document.body.addEventListener('touchstart', emitter.downHandle)
    document.body.addEventListener('touchmove', emitter.moveHandle)
    return dom
  },
  close() {
    document.body.removeEventListener('mousemove', emitter.moveHandle)
    document.body.removeEventListener('mousedown', emitter.downHandle)

    document.body.removeEventListener('touchstart', emitter.downHandle)
    document.body.removeEventListener('touchmove', emitter.moveHandle)
    return emitter.close.apply(this, arguments)
  }
})

