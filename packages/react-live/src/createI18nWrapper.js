import * as React from 'react'
import { decode } from './ghost-string'
import {CLOSE_STR, OPEN_STR, parseWrappedStringLinkedList, stripWrappedString} from './string-utils'
import ModalContent from './Modal/ModalContent'
import escapeReg from 'escape-string-regexp'
import { highlightActiveBadge, unHighlightActiveBadge, updateDOM } from './dom-utils'
import { getOffset } from './utils'
import { open } from './Modal'
import cn from './classnames'

export const RAW_DATA_SEP = '\u200f'

function proxyEvents(props, config = {}) {
  return Object.keys(config).reduce((map, name) => {
    if (typeof config[name] === 'function') {
      const fn = props[name]
      map[name] = function() {
        if (typeof fn === 'function') {
          fn.apply(this, arguments)
        }
        config[name].apply(this, arguments)
      }
    }
    return map
  }, {})
}

export function parseTranslatedString(encodedValue, { strip = true, data = true } = {}) {
  const dataList = []

  const rawContent = stripWrappedString(encodedValue, {
    transform: (chunk, { openStr, closeStr }) => {
      const pos = chunk.split('').lastIndexOf(RAW_DATA_SEP)
      if (pos >= 0) {
        data && dataList.push(decode(chunk.slice(pos + 1)))
        if (strip) {
          return chunk.slice(0, pos)
        }
        return `${closeStr}${chunk.slice(0, pos)}${openStr}`
      }
      return chunk
    },
  })

  return {
    dataList,
    rawContent
  }
}

function useForceUpdate() {
  const [v, set] = React.useState(0)
  const update = React.useCallback(() => {
    set(v => v + 1)
  }, [])

  return [v, update]
}

export default function createI18nWrapper({ badge, createElement, transaction, tinyI18n, highlight } = {}) {

  return function I18nWrapper({ children }) {
    let newProps
    const uniqDataMap = new Map()
    const i18nWhereMap = new Map()
    const handleTranslatedString = (value, where) => {
      const { dataList, rawContent } = parseTranslatedString(value, { strip: false })

      const chunksLinked = parseWrappedStringLinkedList(rawContent, {
        closeStr: OPEN_STR,
        openStr: CLOSE_STR,
      })

      let chunks = []
      chunksLinked.toArray().forEach(item => {

      })

      console.log(dataList)
      dataList.forEach((value, i) => {
        try {
          const [key, data] = JSON.parse(value)

          if (key) {
            const array = !i18nWhereMap.get(key) ? [] : i18nWhereMap.get(key)
            array.push([where, [

            ]])

            i18nWhereMap.set(key, array)
            uniqDataMap.set(key, data)
          }
        } catch (e) {}
      })
      return rawContent
    }

    const config = { ...children.props }
    delete config.children
    const names = Object.keys(config)
    names.forEach(configKey => {
      const node = config[configKey]
      if (typeof node === 'string') {
        config[configKey] = handleTranslatedString(node, configKey)
      }
    })

    const newChildren = React.Children.toArray(children.props.children).map((node, index) => {
      if (typeof node === 'string') {
        return handleTranslatedString(node, `children[${index}]`)
      }
      return node
    })

    if (!uniqDataMap.size) {
      return children
    }

    newProps = {
      ...config,
      className: cn(config.className, '__i18n-translated'),
      'data-i18n-react-live': JSON.stringify(
        [...i18nWhereMap.keys()].reduce((acc, n) => {
          acc[n] = i18nWhereMap.get(n)
          return acc
        }, {})
      ),
      ...proxyEvents(config, {
        onMouseEnter: function({ target }) {
          const keys = [...uniqDataMap.keys()]
          badge.close()
          const ctx = {}

          const argsGetterList = keys.map(key => lang => uniqDataMap.get(key))
          const content = (
            <ModalContent
              createElement={createElement}
              transaction={transaction}
              tinyI18n={tinyI18n}
              onClose={unHighlightActiveBadge}
              onActiveUpdate={(newId, oldId) => {
                unHighlightActiveBadge()
                highlightActiveBadge(newId)
              }}
              ref={ref => (ctx.content = ref)}
              keyList={keys}
              translatedGetterList={keys.map(key => lang => {
                const cLang = tinyI18n.getCurrentLanguage()
                tinyI18n.setLanguage(lang)
                const args = uniqDataMap.get(key)
                const string = parseTranslatedString(tinyI18n.i18n(key, ...args), { data: false }).rawContent
                tinyI18n.setLanguage(cLang)
                return string
              })}
              argsGetterList={argsGetterList}
              inputValueList={keys.map(key => tinyI18n.getWord(key))}
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
                      parseTranslatedString(
                        tinyI18n.i18n.apply(null, [data.data.id].concat(argsGetterList[index](ctx.content.lang))),
                        {
                          data: false
                        }
                      ).rawContent
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
            tinyI18n: tinyI18n,
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
        }
      }),
      children: newChildren
    }

    return React.cloneElement(children, newProps)
  }
}
