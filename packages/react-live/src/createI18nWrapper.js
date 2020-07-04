import * as React from 'react'
import { decode } from './ghost-string'
import { CLOSE_STR, OPEN_STR, parseWrappedStringLinkedList, stripWrappedString } from './string-utils'
import ModalContent from './Modal/ModalContent'
import { highlightActiveBadge, unHighlightActiveBadge, updateDOM, updateDOMAttr } from './dom-utils'
import { getOffset } from './utils'
import Modal from './Modal'
import cn from './classnames'

export const RAW_DATA_SEP = '\u200f'
const {open} = Modal

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
        data && dataList.push(JSON.parse(decode(chunk.slice(pos + 1))))
        return chunk.slice(0, pos)
      }
      return chunk
    }
  })

  return {
    dataList,
    rawContent
  }
}

export function translatedStringI18n(encodedValue, tinyI18n) {
  const dataList = []

  const rawContent = stripWrappedString(encodedValue, {
    transform: (chunk, { openStr, closeStr }) => {
      const pos = chunk.split('').lastIndexOf(RAW_DATA_SEP)
      if (pos >= 0) {
        let [key, argv] = JSON.parse(decode(chunk.slice(pos + 1)))
        // www
        argv = argv.map(x => parseTranslatedString(x).rawContent)
        dataList.push([key, argv])
        return tinyI18n.i18n(key, ...argv)
      }
      return chunk
    }
  })
  return {
    rawContent,
    dataList
  }
}

export default function createI18nWrapper({
  badge,
  createElement,
  transaction,
  originTinyI18n,
  tinyI18n,
  highlight
} = {}) {
  return function I18nWrapper({ children }) {
    let newProps
    const uniqDataMap = new Map()
    const i18nWhereMap = new Map()
    const handleTranslatedString = (value, where) => {
      const { dataList, rawContent } = translatedStringI18n(value, originTinyI18n)

      where &&
        dataList.forEach((dataValue, i) => {
          try {
            const [key, data] = dataValue

            if (key) {
              const array = !i18nWhereMap.get(key) ? [] : i18nWhereMap.get(key)
              array.push([where, value])

              i18nWhereMap.set(key, array)
              uniqDataMap.set(key, data)
            }
          } catch (e) {}
        })
      return rawContent
    }

    const config = { ...children.props }
    delete config.children
    // hmr update loop
    //
    delete config['data-i18n-react-live']
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
        Array.from(i18nWhereMap.keys()).reduce((acc, n) => {
          acc[n] = i18nWhereMap.get(n)
          return acc
        }, {})
      ),
      ...proxyEvents(config, {
        onMouseEnter: function({ target }) {
          const keys = Array.from(uniqDataMap.keys())
          badge.close()
          const ctx = {}

          const argsGetter = (key, lang) =>
            uniqDataMap.get(key).map(argVal => {
              let cLang
              if (lang) {
                cLang = originTinyI18n.getCurrentLanguage()
                originTinyI18n.setLanguage(lang)
              }
              const result = translatedStringI18n(argVal, originTinyI18n).rawContent
              if (cLang) {
                originTinyI18n.setLanguage(cLang)
              }
              return result
            })
          const argsGetterList = keys.map(key => lang => argsGetter(key, lang))
          const translate = (key, lang) => {
            const cLang = originTinyI18n.getCurrentLanguage()
            originTinyI18n.setLanguage(lang)
            const args = argsGetter(key)
            const string = originTinyI18n.i18n(key, ...args)
            originTinyI18n.setLanguage(cLang)
            return string
          }
          const content = (
            <ModalContent
              createElement={createElement}
              transaction={transaction}
              tinyI18n={originTinyI18n}
              onClose={unHighlightActiveBadge}
              onActiveUpdate={(newId, oldId) => {
                unHighlightActiveBadge()
                highlightActiveBadge(newId)
              }}
              ref={ref => (ctx.content = ref)}
              keyList={keys}
              translatedGetterList={keys.map(key => lang => {
                return translate(key, lang)
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
                    const encodedValue = tinyI18n.i18n.apply(
                      null,
                      [data.data.id].concat(argsGetterList[index](ctx.content.lang))
                    )
                    updateDOMAttr(target, data.data.id, {
                      encodedValue,
                      stripedValue: parseTranslatedString(encodedValue, {
                        data: false
                      }).rawContent
                    })
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
        }
      }),
      children: newChildren
    }

    return React.cloneElement(children, newProps)
  }
}


