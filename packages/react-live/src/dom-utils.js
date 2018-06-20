/**
 * @file: dom-utils
 * @author: Cuttle Cong
 * @date: 2017/12/20
 * @description:
 */
const debug = require('debug')('@tiny-i18n/react-live')
import { rStrip, strip, toWrappedString } from './utils'

export function getDOMListFromID(id) {
  return [...document.querySelectorAll(`*[data-i18n-keylist*=${JSON.stringify(JSON.stringify(id))}]`)]
}

export function highlightActiveBadge(id) {
  const list = getDOMListFromID(id)
  list.forEach(ele => {
    ele.classList.add('i18n-active')
  })
}

export function unHighlightActiveBadge() {
  const list = [...document.querySelectorAll('*[data-i18n-keylist].i18n-active')]
  list.forEach(ele => {
    ele.classList.remove('i18n-active')
  })
}

export function updateDOM(el, id, oldRaw, newRaw) {
  const list = getDOMListFromID(id)
  debug('updateDOM list: %o', list)

  function replace(content, maxLev) {
    if (maxLev < 1) {
      return content
    }

    let striped = strip(
      content,
      (str, level, _) => {
        // console.log(str, maxLev)
        debug('strip str chunk', str)
        // level = level || 1
        if (str === oldRaw) {
          return toWrappedString(newRaw, void 0, maxLev)
        }

        if (maxLev > 1) {
          return toWrappedString(replace(str, maxLev - 1), void 0, maxLev)
        }

        return _
      },
      maxLev
    )
    return replace(striped, maxLev - 1)
  }

  list.forEach(ele => {
    let pathmap = ele.getAttribute('data-i18n-pathmap') || '{}'
    try {
      pathmap = JSON.parse(pathmap)
    } catch (e) {
      pathmap = {}
    }

    const paths = pathmap[id]
    if (paths) {
      paths.forEach(([p, maxLev]) => {
        if (/^children\[(\d+)]$/.test(p)) {
          const index = parseInt(RegExp.$1)
          const node = ele.childNodes[index]

          node.textContent = replace(node.textContent, maxLev)
        } else {
          ele.setAttribute(p, replace(ele.getAttribute(p), maxLev))
        }
      })
    }
  })
}
