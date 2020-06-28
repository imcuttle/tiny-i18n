/**
 * @file register
 * @author Cuttle Cong
 * @date 2018/6/19
 * @description
 */
import live from './index'
const { createElement, tinyI18n, configure } = live

let cached = {}

export function use() {
  unuse()

  configure({
    enabled: true
  })
  cached.i18n = require('tiny-i18n').i18n
  cached.setLanguage = require('tiny-i18n').setLanguage
  cached.createElement = require('react').createElement

  require('tiny-i18n').i18n = tinyI18n.i18n
  require('tiny-i18n').setLanguage = tinyI18n.setLanguage
  require('react').createElement = createElement
}

export function unuse() {
  configure({
    enabled: false
  })

  if (cached.i18n) {
    require('tiny-i18n').i18n = cached.i18n
  }
  if (cached.setLanguage) {
    require('tiny-i18n').setLanguage = cached.setLanguage
  }
  if (cached.createElement) {
    require('react').createElement = cached.createElement
  }

  cached = {}
}

use()
