/**
 * @file: dom-utils
 * @author: Cuttle Cong
 * @date: 2017/12/20
 * @description:
 */
export const NULL_CHAR = '\u200C'

export function getDOMListFromID(id) {
  return [...document.querySelectorAll(`*[data-i18n-id*=${JSON.stringify(JSON.stringify(id))}]`)]
}

export function highlightActiveBadge(id) {
  const list = getDOMListFromID(id)
  list.forEach(ele => {
    ele.classList.add('i18n-active')
  })
}

export function unHighlightActiveBadge() {
  const list = [...document.querySelectorAll('.i18n-active.i18n-badge')]
  list.forEach(ele => {
    ele.classList.remove('i18n-active')
  })
}

export function updateDOM(el, id, oldRaw, newRaw) {
  const list = getDOMListFromID(id)
  list.forEach(ele => {
    let path = ele.getAttribute('data-i18n-path') || '[]'
    try {
      path = JSON.parse(path)
    } catch (e) {
      path = []
    }

    path.forEach(p => {
      if (p === 'children') {
        // 对应单一child的情况
        if (ele.textContent === oldRaw) {
          ele.textContent = newRaw
        }
        else {
          // 包含的问题？
          // 1. 复制带有不可见字符
          // 2. _i('tpl', _i('abc')) 的更新问题
          //  `${NULL_CHAR} tpl of ${NULL_CHAR}abc{NULL_CHAR} abc ${NULL_CHAR}`

          // @todo 考虑改成记录 字符串索引位置（不用不可见字符）？
          ele.textContent = ele.textContent.replace(
            new RegExp(NULL_CHAR + '(.*?)' + NULL_CHAR, 'g'),
            (_, $1) => {
              if ($1 === oldRaw) {
                $1 = newRaw
              }
              return NULL_CHAR + $1 + NULL_CHAR
            }
          )
        }
      }
      else {
        if (ele.getAttribute(p) === oldRaw) {
          ele.setAttribute(p, newRaw)
        }
      }
    })
  })
}
