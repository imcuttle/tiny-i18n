/**
 * @file register
 * @author Cuttle Cong
 * @date 2018/6/19
 * @description
 */
import { wrappedCreateElement, wrappedI18n, wrappedSetLanguage } from './src'

if (!global.__TINY_I18N_REACT_LIVE__) {
  require('tiny-i18n').i18n = wrappedI18n
  require('tiny-i18n').setLanguage = wrappedSetLanguage
  require('react').createElement = wrappedCreateElement
}
global.__TINY_I18N_REACT_LIVE__ = true
