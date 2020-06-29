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
import { getMaxLevel, rStrip, proxy, getOffset, toWrappedString, createSingleElementView, strip } from './utils'
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

export default function createReactI18nLiveCore({
  tinyI18n = defaultTinyI18n,
  transaction,
  createElement = React.createElement
} = {}) {
  tinyI18n = {...tinyI18n}
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

  return {
    transaction,
    configure,
    getSetting() {
      return setting
    },
    tinyI18n: {
      ...tinyI18n,
      setLanguage: createWrappedSetLanguage(tinyI18n.setLanguage.bind(tinyI18n), { setting, transaction }),
      i18n: createWrappedI18n(tinyI18n.i18n.bind(tinyI18n), { setting })
    },
    createElement: makeWrappedCreateElement(createElement, {
      tinyI18n,
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

    let maxLev = 0
    argumentArray.forEach(arg => {
      maxLev = Math.max(getMaxLevel(String(arg)), maxLev)
    })

    return toWrappedString(JSON.stringify(argumentArray), 1 + maxLev)
  }
}

function makeWrappedCreateElement(
  createElement,
  { transaction, setting = defaultSetting, tinyI18n, highlight = false } = {}
) {
  return function wrappedCreateElement(type, config, ...children) {
    if (!setting.enabled) {
      return createElement.apply(this, [type, config].concat(children))
    }

    const keyListContainer = []
    const pathMapContainer = {}

    const argsGetterList = []
    const translatedGetterList = []
    function handleTranslatedString(string, path) {
      const list = []

      let maxLev = 1
      function recursiveStrip(string) {
        console.log('string', string)
        return strip(string, (str, level) => {
          const data = JSON.parse(str)
          if (!isNaN(level)) {
            level = parseInt(level)
          } else {
            level = 1
          }

          maxLev = Math.max(level, maxLev)
          list.push(data)

          // Supports nested case when updating dom
          // eg. i18n('abc', i18n('hhh'))

          // Strips the outermost wrapper
          function translatedGetter(key, argsGetter, lang = tinyI18n.getCurrentLanguage()) {
            const data = [key].concat(argsGetter(lang))
            let old = tinyI18n.getCurrentLanguage()
            tinyI18n.setLanguage(lang)
            const rlt = rStrip(
              tinyI18n.i18n.apply(null, data),
              (s, a, b, c, count) => {
                const data = JSON.parse(s)
                return toWrappedString(translatedGetter(data[0], () => data.slice(1), lang), void 0, count)
              },
              level - 1
            )
            tinyI18n.setLanguage(old)
            return rlt
          }
          // Strips the outermost wrapper
          function argsGetter(args, lang) {
            return args.map(arg =>
              rStrip(
                String(arg),
                (s, a, b, c, count) => {
                  const data = JSON.parse(s)
                  return toWrappedString(translatedGetter(data[0], () => data.slice(1), lang), void 0, count)
                },
                level - 1
              )
            )
          }
          const cloneData = JSON.parse(str)
          const eachArgsGetter = argsGetter.bind(null, cloneData.slice(1))
          argsGetterList.push(eachArgsGetter)
          translatedGetterList.push(translatedGetter.bind(null, cloneData[0], eachArgsGetter))

          if (data) {
            // Parse recursive args
            // eg.  _i('abc', _i('jjj'))
            data.splice(1, data.length - 1, ...data.slice(1).map(arg => recursiveStrip(String(arg))))
          }
          let rlt = tinyI18n.i18n.apply(null, data)
          // Repeats wrapping open/close char
          // eg. [x][x]Hi,([x]lala[y])[y][y]
          if (highlight) {
            return toWrappedString(rlt, void 0, level)
          }
          return rlt
        })
      }

      const striped = recursiveStrip(string)
      list.forEach(([id, ...args]) => {
        if (!keyListContainer.includes(id)) {
          keyListContainer.push(id)
        }

        pathMapContainer[id] = pathMapContainer[id] || []
        const pathMap = pathMapContainer[id]
        !pathMap.includes(path) && pathMap.push([path, maxLev])
      })

      return striped
    }

    // Render html markup
    if (typeof type === 'string') {
      children = children.map((node, index) => {
        if (typeof node === 'string') {
          return handleTranslatedString(node, `children[${index}]`)
        }
        return node
      })

      config = config || {}
      config = { ...config }
      const keyList = Object.keys(config)
      keyList.forEach(configKey => {
        const node = config[configKey]
        if (typeof node === 'string') {
          config[configKey] = handleTranslatedString(node, configKey)
        }
      })
    }

    // Contains translated property and child.
    if (highlight && !!keyListContainer.length) {
      config['data-i18n-keylist'] = JSON.stringify(keyListContainer)
      // config['data-i18n-argslist'] = JSON.stringify(argsListContainer)
      config['data-i18n-pathmap'] = JSON.stringify(pathMapContainer)

      proxy(config, 'onMouseEnter', _onMouseEnter => {
        return function onMouseEnter({ target }) {
          badge.close()
          const ctx = {}
          // function getTranslatedList() {
          //   return translatedGetterList.map(cb => cb())
          // }
          // function getArgsList() {
          //   return argsGetterList.map(cb => cb())
          // }
          const content = (
            <ModalContent
              transaction={transaction}
              tinyI18n={tinyI18n}
              onClose={unHighlightActiveBadge}
              onActiveUpdate={(newId, oldId) => {
                unHighlightActiveBadge()
                highlightActiveBadge(newId)
              }}
              ref={ref => (ctx.content = ref)}
              keyList={keyListContainer}
              // argsList={getArgsList()}
              translatedGetterList={translatedGetterList}
              argsGetterList={argsGetterList}
              inputValueList={keyListContainer.map(key => tinyI18n.getWord(key))}
              onSave={async data => {
                let passed = await transaction.update({
                  id: data.data.id,
                  value: data.value
                })
                if (passed) {
                  tinyI18n.extendDictionary(
                    {
                      [data.data.id]: data.value
                    },
                    ctx.content.lang
                  )
                  const { index } = ctx.content.state
                  if (ctx.content.lang === tinyI18n.getCurrentLanguage()) {
                    updateDOM(
                      target,
                      data.data.id,
                      data.data.raw,
                      tinyI18n.i18n.apply(null, [data.data.id].concat(argsGetterList[index](ctx.content.lang)))
                    )
                  }

                  ctx.content.forceUpdate()
                  transaction.emit('afterUpdate', { lang: ctx.content.lang, ...data })
                }
              }}
            />
          )
          const dom = badge.open({
            transaction,
            tinyI18n,
            onClick() {
              open({ children: content })
            }
          })
          const { top, left } = getOffset(target)
          Object.assign(dom.style, {
            position: 'absolute',
            top: `${top}px`,
            left: `${left}px`,
            zIndex: 999999
          })

          if (typeof _onMouseEnter === 'function') {
            return _onMouseEnter.apply(this, arguments)
          }
        }
      })
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
