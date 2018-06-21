/**
 * @file Provider
 * @author Cuttle Cong
 * @date 2018/6/19
 * @description
 */

import React from 'react'
import PropTypes from 'prop-types'

const ti = require('tiny-i18n')

export default class Provider extends React.Component {
  static propTypes = {}
  static defaultProps = {}

  static childContextTypes = {
    i18n: PropTypes.object
  }

  /**
   * Wraps each function for update children components
   */
  wrapFunction(getter) {
    let func = getter()
    const self = this
    if (typeof func === 'function') {
      return function() {
        // Cancelled: Use getter for syncing i18n.setLanguage
        // func = getter()
        const rlt = func.apply(this, arguments)
        self.forceUpdate()
        return rlt
      }
    }
    return func
  }

  getChildContext() {
    const context = {}
    Object.keys(ti).forEach(key => {
      context[key] = this.wrapFunction(() => ti[key])
    })

    return {
      i18n: context
    }
  }

  render() {
    return React.Children.only(this.props.children)
  }
}
