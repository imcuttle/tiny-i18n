import yalList from 'yallist'

export const OPEN_STR = '\u206e'
export const CLOSE_STR = '\u206f'

export function wrapString(string, { openStr = OPEN_STR, closeStr = CLOSE_STR } = {}) {
  if (typeof string === 'string') {
    return `${openStr}${string}${closeStr}`
  }
  return string
}

const getStrSize = str => {
  return Array.from(str).length
}

export function parseWrappedStringLinkedList(
  wrappedString,
  { openStr = OPEN_STR, closeStr = CLOSE_STR, allowEmptyContent = true } = {}
) {
  const linkedList = yalList.create()
  const createValue = (str, type) => {
    return {
      content: str,
      type
    }
  }

  const pushTextNode = text => {
    if (!linkedList.tail || linkedList.tail.value.type !== 'text') {
      return linkedList.push(createValue(text, 'text'))
    }
    linkedList.tail.value.content += text
  }

  const openStack = []
  const strArray = Array.from(wrappedString)
  const openSize = getStrSize(openStr)
  const closeSize = getStrSize(closeStr)

  let i = 0
  while (i < strArray.length) {
    const char = strArray[i]
    const str = strArray.slice(i).join('')
    if (str.startsWith(openStr)) {
      linkedList.push(createValue(openStr, 'guess-open'))
      openStack.push(linkedList.tail)
      i += openSize
      continue
    }

    if (str.startsWith(closeStr) && openStack.length) {
      if (allowEmptyContent || (linkedList.tail.value.type === 'text' && linkedList.tail.value.content !== '')) {
        const openNode = openStack.pop()
        openNode.value.type = 'open'

        linkedList.push(createValue(closeStr, 'close'))
        i += closeSize
        continue
      }
    }

    if (!openStack.length) {
      pushTextNode(char)
    } else {
      pushTextNode(char)
    }
    i++
  }

  const mergeTextNode = node => {
    if (!node || node.value.type !== 'text') {
      return
    }
    const prev = node.prev
    if (prev && prev.value.type === 'text') {
      prev.value.content += node.value.content
      linkedList.removeNode(node)
      mergeTextNode(prev)
      return
    }

    const next = node.next
    if (next && next.value.type === 'text') {
      next.value.content = node.value.content + next.value.content
      linkedList.removeNode(node)
      mergeTextNode(next)
    }
  }

  // guess-open -> text
  openStack.forEach(node => {
    node.value.type = 'text'
    mergeTextNode(node)
  })

  return linkedList
}

export function stripWrappedString(
  wrappedString,
  { level = 1, transform, allowEmptyContent, openStr = OPEN_STR, closeStr = CLOSE_STR } = {}
) {
  const linked = parseWrappedStringLinkedList(wrappedString, {
    openStr,
    closeStr,
    allowEmptyContent
  })

  const stripByLinkedNode = head => {
    let string = ''
    let endNode = null
    if (!head) {
      return {
        string,
        endNode
      }
    }

    let prefix = ''
    if (head.value.type !== 'open') {
      while (head) {
        const { type, content } = head.value
        if ('text' === type) {
          prefix += content
        } else {
          break
        }
        head = head.next
      }
    }

    head = head && head.next
    while (head) {
      const { type, content } = head.value
      if (type === 'open') {
        const { string: newString, endNode } = stripByLinkedNode(head)
        string += newString
        head = endNode
        continue
      } else if ('text' === type) {
        string += content
      } else {
        // close
        string = stripWrappedString(string, { level: level + 1, transform, openStr, closeStr })
        if (typeof transform === 'function') {
          string = transform(string, { level, openStr, closeStr })
        }
        return {
          endNode: head.next,
          string: prefix + string
        }
      }

      head = head.next
    }

    return {
      string: prefix + string,
      endNode: head
    }
  }

  const stripByLinkedNodeAll = head => {
    const { string, endNode } = stripByLinkedNode(head)
    let suffix = ''
    head = endNode
    while (head) {
      const { type, content } = head.value
      if ('text' === type) {
        suffix += content
      } else {
        const { string: newString, endNode } = stripByLinkedNode(head)
        suffix += newString
        head = endNode
        continue
      }
      head = head.next
    }

    return string + suffix
  }

  return stripByLinkedNodeAll(linked.head)
}

export function mergeWrappedStringLinked(
  wrappedString,
  { transform, allowEmptyContent, openStr = OPEN_STR, closeStr = CLOSE_STR } = {}
) {
  const linked = parseWrappedStringLinkedList(wrappedString, {
    openStr,
    closeStr,
    allowEmptyContent
  })

  let openStack = []
  let head = linked.head
  while (head) {
    const { type } = head.value
    if (type === 'open') {
      openStack.push(head)
    } else if (type === 'close') {
      const openNode = openStack.pop()
      const newHead = head.next
      linked.removeNode(openNode)
      linked.removeNode(head)
      head = newHead

      if (head.prev) {
        // console.log(head.prev.value)
        const content = transform ? transform(head.prev.value.content) : head.prev.value.content;
        // if (content === '') {
          // linked.removeNode(head.prev)
        // }
        // else {
          head.prev.value.type = 'chunk-text';
          head.prev.value.content = content;
        // }
      }
      continue
    } else {
    }

    head = head.next
  }

  return linked
}
