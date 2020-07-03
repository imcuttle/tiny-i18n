/**
 * @file register
 * @author Cuttle Cong
 * @date 2018/6/19
 * @description
 */
import live from './index'
import defaultTinyI18n from './defaultTinyI18n'
const { createElement, tinyI18n: overrideTinyI18n, configure } = live

let cached = {}

export function unuse() {
  configure({
    enabled: false
  })

  if (cached.i18n) {
    overrideTinyI18n.i18n = cached.i18n
  }
  if (cached.setLanguage) {
    overrideTinyI18n.setLanguage = cached.setLanguage
  }
  if (cached.createElement) {
    require('react').createElement = cached.createElement
  }

  cached = {}
}

export function use(tinyI18n = defaultTinyI18n) {
  unuse()

  configure({
    enabled: true
  })
  cached.i18n = tinyI18n.i18n
  cached.setLanguage = tinyI18n.setLanguage
  cached.createElement = require('react').createElement

  tinyI18n.i18n = overrideTinyI18n.i18n
  tinyI18n.setLanguage = overrideTinyI18n.setLanguage
  require('react').createElement = createElement
}

use()
