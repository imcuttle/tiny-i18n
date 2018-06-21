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
import transaction from './transaction'

const tinyI18n = require('tiny-i18n')

export { default as Provider } from './Provider'
export { default as inject } from './inject-i18n'
export { default as transaction } from './transaction'

const { createElement: pureCreateElement } = React
const { i18n: pureI18n, getWord, setLanguage, extendDictionary, getCurrentLanguage, getDictionary } = tinyI18n

const badge = createSingleElementView()
proxy(badge, 'open', function(open) {
  return function(props, attributes, mountDom) {
    return open(<BadgeInner {...props} />, attributes, mountDom)
  }
})

export const i18n = pureI18n
// export const setLanguage = pureI18n
export const createElement = pureCreateElement

// Overwrites `tinyI18n.i18n` for inject some data.
export function wrappedI18n(key, ...args) {
  const argumentArray = [].slice.call(arguments)

  let maxLev = 0
  argumentArray.forEach(arg => {
    maxLev = Math.max(getMaxLevel(String(arg)), maxLev)
  })

  return toWrappedString(JSON.stringify(argumentArray), 1 + maxLev)
}

function makeWrappedCreateElement(highlight) {
  return function wrappedCreateElement(type, config, ...children) {
    const keyListContainer = []
    const pathMapContainer = {}

    const argsGetterList = []
    const translatedGetterList = []
    function handleTranslatedString(string, path) {
      const list = []

      let maxLev = 1
      function recursiveStrip(string) {
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
          function translatedGetter(key, argsGetter, lang = getCurrentLanguage()) {
            const data = [key].concat(argsGetter(lang))
            let old = getCurrentLanguage()
            tinyI18n.setLanguage(lang)
            const rlt = rStrip(
              pureI18n.apply(null, data),
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
          let rlt = pureI18n.apply(null, data)
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
              inputValueList={keyListContainer.map(key => getWord(key))}
              onSave={async data => {
                let passed = await transaction.update({
                  id: data.data.id,
                  value: data.value
                })
                if (passed) {
                  extendDictionary(
                    {
                      [data.data.id]: data.value
                    },
                    ctx.content.lang
                  )
                  const { index } = ctx.content.state
                  if (ctx.content.lang === getCurrentLanguage()) {
                    updateDOM(
                      target,
                      data.data.id,
                      data.data.raw,
                      pureI18n.apply(null, [data.data.id].concat(argsGetterList[index](ctx.content.lang)))
                    )
                  }

                  ctx.content.forceUpdate()
                  transaction.emit('afterUpdate', { lang: ctx.content.lang, ...data })
                }
              }}
            />
          )
          const dom = badge.open({
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

    return pureCreateElement.apply(this, [type, config].concat(children))
  }
}

// Overwrites `React.createElement` for highlighting translated words.
export const wrappedCreateElement = makeWrappedCreateElement(true)

export function wrappedSetLanguage(language) {
  transaction.register(language)
  return setLanguage.apply(this, arguments)
}

// Used in ModalContent
export const wrapped_unhighlight_createElement = makeWrappedCreateElement(false)
