/**
 * @file register
 * @author Cuttle Cong
 * @date 2018/6/19
 * @description
 */
const { wrappedCreateElement, wrapI18n, wrapSetLanguage } = require('./')

function register(i18n = require('tiny-i18n')) {
  if (!i18n.__TINY_I18N_REACT_LIVE__) {
    i18n.i18n = wrapI18n(i18n.i18n)
    i18n.setLanguage = wrapSetLanguage(i18n.setLanguage)

    Object.defineProperty(i18n, '__TINY_I18N_REACT_LIVE__', {
      enumerable: false,
      value: true
    })
  }
  if (!global.__TINY_I18N_REACT_LIVE_REACT__) {
    require('react').createElement = wrappedCreateElement
    global.__TINY_I18N_REACT_LIVE_REACT__ = true
  }
}

module.exports = register
