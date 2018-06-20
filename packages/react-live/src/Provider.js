/**
 * @file Provider
 * @author Cuttle Cong
 * @date 2018/6/19
 * @description
 */

import React from 'react'
import PropTypes from 'prop-types'

import * as ti from 'tiny-i18n'

export default class Provider extends React.Component {
  static propTypes = {}
  static defaultProps = {}

  static childContextTypes = {
    i18n: PropTypes.object
  }

  /**
   * Wrap each functions for update children components
   */
  wrapFunction(func) {
    const self = this
    if (typeof func === 'function') {
      return function() {
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
      const func = ti[key]
      context[key] = this.wrapFunction(func)
    })

    return {
      i18n: context
    }
  }

  render() {
    return React.Children.only(this.props.children)
  }
}
