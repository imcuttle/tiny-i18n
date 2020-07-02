/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/6/18
 * @description
 */

import * as React from 'react'
import { BadgeInner } from './Badge'
import { highlightActiveBadge, unHighlightActiveBadge, updateDOM } from './dom-utils'
import { open } from './Modal/index'
import ModalContent from './Modal/ModalContent'
import { rStrip, proxy, getOffset, createSingleElementView, strip } from './utils'
import { wrapString } from './string-utils'
import createI18nWrapper, { RAW_DATA_SEP } from './createI18nWrapper'
import { encode, decode } from './ghost-string'
import Transaction from './Transaction'

import defaultTinyI18n from './defaultTinyI18n'

const badge = createSingleElementView()
proxy(badge, 'open', function(open) {
  return function(props, attributes, mountDom) {
    return open(<BadgeInner {...props} />, attributes, mountDom)
  }
})

const defaultSetting = {
  enabled: false
}

export default function createReactI18nLive({
  tinyI18n = defaultTinyI18n,
  transaction,
  createElement = React.createElement
} = {}) {
  tinyI18n = { ...tinyI18n }
  if (!(transaction instanceof Transaction)) {
    transaction = new Transaction(tinyI18n, transaction)
  }

  const setting = { ...defaultSetting }

  const configure = config => {
    Object.assign(setting, config)
    if (!setting.enabled) {
      badge.close()
    }
  }

  const overrideTinyI18n = {
    ...tinyI18n,
    setLanguage: createWrappedSetLanguage(tinyI18n.setLanguage.bind(tinyI18n), { setting, transaction }),
    i18n: createWrappedI18n(tinyI18n.i18n.bind(tinyI18n), {
      setting
    })
  }

  return {
    transaction,
    configure,
    getSetting() {
      return setting
    },
    originTinyI18n: tinyI18n,
    tinyI18n: overrideTinyI18n,
    createElement: makeWrappedCreateElement(createElement, {
      originTinyI18n: tinyI18n,
      tinyI18n: overrideTinyI18n,
      transaction,
      setting,
      highlight: true
    })
  }
}

// Overwrites `tinyI18n.i18n` for inject some data.
export function createWrappedI18n(i18n, { setting = defaultSetting } = {}) {
  return function wrappedI18n(key, ...args) {
    const argumentArray = [].slice.call(arguments)

    if (!setting.enabled) {
      return i18n.apply(this, argumentArray)
    }
    const rawTranslated = i18n.apply(this, argumentArray)
    const hideDataString = JSON.stringify([key, args])
    return wrapString(rawTranslated + RAW_DATA_SEP + encode(hideDataString), {
    })
  }
}

function makeWrappedCreateElement(
  createElement,
  { transaction, setting = defaultSetting, originTinyI18n, tinyI18n, highlight = false } = {}
) {
  const I18nWrapper = createI18nWrapper({ badge, originTinyI18n, highlight, transaction, createElement, tinyI18n })
  return function wrappedCreateElement(type, config, ...children) {
    if (!setting.enabled) {
      return createElement.apply(this, [type, config].concat(children))
    }

    // html tag
    if (typeof type === 'string') {
      return I18nWrapper({ children: createElement.apply(this, [type, config].concat(children)) })
    }

    return createElement.apply(this, [type, config].concat(children))
  }
}

export function createWrappedSetLanguage(setLanguage, { setting = defaultSetting, transaction } = {}) {
  return function wrappedSetLanguage(language) {
    if (!setting.enabled) {
      return setLanguage.apply(this, arguments)
    }
    transaction.register(language)
    return setLanguage.apply(this, arguments)
  }
}
