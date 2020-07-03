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

  function getCoreFunc(attributes, mountDOM) {
    return function core(Component) {
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
  }


  if (typeof attributes === 'function') {
    let Component = attributes
    attributes = {}
    mountDOM = void 0
    return getCoreFunc(attributes, mountDOM)(Component)
  }

  return getCoreFunc(attributes, mountDOM)
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

export const OPEN_CHAR = '\u200b'
export const CLOSE_CHAR = '\u200c'
export function toWrappedString(string, level = '', repeatCount = 1) {
  return `${OPEN_CHAR.repeat(repeatCount)}${level}${string}${level}${CLOSE_CHAR.repeat(repeatCount)}`
}

function getReg(repeatCount = 1) {
  return new RegExp(`[${OPEN_CHAR}]{${repeatCount}}(\\d?)(.+?)\\1[${CLOSE_CHAR}]{${repeatCount}}`, 'g')
}

export function getMaxLevel(string, level = '') {
  const reg = getReg()
  let maxLevel = 0
  while (reg.test(string)) {
    const { $1 } = RegExp
    if (!isNaN($1)) {
      maxLevel = Math.max(maxLevel, parseInt(RegExp.$1))
    }
  }
  return maxLevel
}

function countString(content, chunk) {
  let count = 0
  content.replace(new RegExp(chunk, 'g'), () => {
    count++
  })
  return count
}

export function strip(string = '', stripFn = (data, l, _) => _, repeatCount = 1) {
  const reg = getReg(repeatCount)
  return string.replace(reg, function(_, level, matched, lastIndex, allString) {
    const restString = allString.slice(lastIndex + _.length)
    const openCount = countString(_, OPEN_CHAR)
    const closeCount = countString(_, CLOSE_CHAR)

    if (openCount !== closeCount) {
      let n = openCount - closeCount
      let pos = 0
      // openCount > closeCount
      while (n > 0 && restString[pos] === CLOSE_CHAR) {
        _ += restString[pos]
        matched += restString[pos]
        reg.lastIndex++
        pos++
        n--
      }
    }

    try {
      const rlt = stripFn(matched, level, _, lastIndex)
      return rlt
    } catch (e) {
      return _
    }
  })
}

export function rStrip(string = '', stripFn, repeatCount = 1) {
  if (repeatCount <= 0) {
    return string
  }
  function wrappedStripFn() {
    return stripFn.apply(this, [...arguments].concat(repeatCount))
  }
  return strip(
    string,
    function(string) {
      if (repeatCount - 1 > 0) {
        arguments[0] = rStrip(string, wrappedStripFn, repeatCount - 1)
      }
      return wrappedStripFn.apply(this, arguments)
    },
    repeatCount
  )
}
