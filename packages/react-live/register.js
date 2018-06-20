/**
 * @file register
 * @author Cuttle Cong
 * @date 2018/6/19
 * @description
 */
import { createElement, i18n } from './src'

if (!global.__TINY_I18N_REACT_LIVE__) {
  require('tiny-i18n').i18n = i18n
  require('react').createElement = createElement
}
global.__TINY_I18N_REACT_LIVE__ = true
