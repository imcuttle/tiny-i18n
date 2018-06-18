/**
 * @file: utils
 * @author: Cuttle Cong
 * @date: 2017/12/19
 * @description:
 */
import ReactDOM from 'react-dom'
import React from 'react'

exports.styleUsable = function(style) {
  const sty = document.createElement('style')
  const head = document.head || document.getElementsByTagName('head')[0]
  sty.type = 'text/css'
  sty.textContent = style

  return {
    use() {
      head.appendChild(sty)
    },
    unuse() {
      head.removeChild(sty)
    }
  }
}

function createSingleElementView() {
  let container = null
  const getContainer = (mountDOM = document.body, attributes) => {
    if (!container) {
      container = document.createElement('div')
      mountDOM.appendChild(container)
    }
    return Object.assign(container, attributes)
  }

  return {
    close() {
      let dom = getContainer()
      ReactDOM.unmountComponentAtNode(dom)
      dom.parentNode.removeChild(dom)
      container = null
    },
    open(element, attributes, mountDOM = document.body) {
      const dom = getContainer(mountDOM, attributes)
      ReactDOM.render(element, dom)
      return dom
    }
  }
}

exports.createSingleElementView = createSingleElementView

exports.getOffset = function(el) {
  el = el.getBoundingClientRect()
  return {
    left: el.left + global.scrollX,
    top: el.top + global.scrollY
  }
}

exports.singleView = function(attributes, mountDOM) {
  const center = createSingleElementView()
  function core(Component) {
    return class SingleView extends React.Component {
      componentDidMount() {
        center.open(this.comp, attributes, mountDOM)
      }

      componentDidUpdate() {
        center.open(this.comp, attributes, mountDOM)
      }

      componentWillUnmount() {
        center.close()
      }

      get comp() {
        const { children, ...props } = this.props
        return <Component {...props}>{children}</Component>
      }

      render() {
        return null
      }
    }
  }

  if (typeof attributes === 'function') {
    attributes = {}
    mountDOM = void 0
    return core()
  }

  return core
}

exports.isElementOf = Component => {
  // Trying to solve the problem with 'children: XXX.isRequired'
  // (https://github.com/gaearon/react-hot-loader/issues/710). This does not work for me :(
  const originalPropTypes = Component.propTypes
  Component.propTypes = undefined

  // Well known workaround
  const elementType = <Component />.type

  // Restore originalPropTypes
  Component.propTypes = originalPropTypes

  return element => element && element.type === elementType
}

exports.proxy = (ref, name, callback) => {
  if (ref) {
    if (callback) {
      ref[name] = callback.call(ref, ref[name])
    }
  }
}
