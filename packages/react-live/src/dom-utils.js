import { stripWrappedString } from './string-utils'

/**
 * @file: dom-utils
 * @author: Cuttle Cong
 * @date: 2017/12/20
 * @description:
 */
import { decode } from './ghost-string'
import { parseTranslatedString, RAW_DATA_SEP } from './createI18nWrapper'


export function getDOMListFromID(id) {
  return [].slice.call(document.querySelectorAll(`*[data-i18n-react-live*=${JSON.stringify(JSON.stringify(id))}]`))
}

export function highlightActiveBadge(id) {
  const list = getDOMListFromID(id)
  list.forEach(ele => {
    ele.classList.add('i18n-active')
  })
}

export function unHighlightActiveBadge() {
  const list = [].slice.call(document.querySelectorAll('*[data-i18n-react-live].i18n-active'))
  list.forEach(ele => {
    ele.classList.remove('i18n-active')
  })
}

function replace(encodedValue, key, newValue) {
  const stringData = stripWrappedString(encodedValue, {
    transform: (chunk, { openStr, closeStr }) => {
      const pos = chunk.split('').lastIndexOf(RAW_DATA_SEP)
      if (pos >= 0) {
        const [keyName, argvs] = JSON.parse(decode(chunk.slice(pos + 1)))
        if (keyName === key) {
          return newValue.encodedValue
        }

        return `${openStr}${chunk}${closeStr}`
      }
      return `${openStr}${chunk}${closeStr}`
    }
  })

  return {
    encodedValue: stringData,
    stripedValue: parseTranslatedString(stringData, { data: false }).rawContent
  }
}

export function updateDOMAttr(el, id, newVal) {
  const list = getDOMListFromID(id)

  list.forEach(ele => {
    let pathmap = ele.getAttribute('data-i18n-react-live') || '{}'
    try {
      pathmap = JSON.parse(pathmap)
    } catch (e) {
      pathmap = {}
    }

    const paths = pathmap[id]
    if (paths) {
      const newPaths = paths.map(([path, stringWithData]) => {
        if (/^children\[(\d+)]$/.test(path)) {
          const index = parseInt(RegExp.$1)
          const node = ele.childNodes[index]

          const { encodedValue, stripedValue } = replace(stringWithData, id, newVal)
          node.textContent = stripedValue
          return [path, encodedValue]
        } else {
          const { encodedValue, stripedValue } = replace(stringWithData, id, newVal)
          ele.setAttribute(path, stripedValue)
          return [path, encodedValue]
        }
      })

      pathmap[id] = newPaths

      ele.setAttribute('data-i18n-react-live', JSON.stringify(pathmap))
    }
  })
}
