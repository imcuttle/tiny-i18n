/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/6/18
 * @description
 */

import * as tinyI18n from 'tiny-i18n'
import * as React from 'react'

import { proxy } from './utils'

const { createElement: pureCreateElement } = React
const { i18n: pureI18n } = tinyI18n


// Overwrites `React.createElement` for highlighting translated words.
proxy(React, 'createElement', function (createElement) {
  return function createElement(type, config, ...children) {
    // Without i18n Badge
    const pureCreateElement = () => createElement.apply(this, arguments)


  }
})
