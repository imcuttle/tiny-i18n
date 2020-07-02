const { encode, decode } = require('../src/ghost-string')
const { wrapString, mergeWrappedStringLinked, parseWrappedStringLinkedList, stripWrappedString } = require('../src/string-utils')

describe('react-live string', function() {
  it('should encode&decode', function() {
    const word = 'hi world'
    const encoded = encode(word)
    expect(encoded).toMatchSnapshot()

    expect(decode(encoded)).toBe(word)
  })

  it('should wrapString&stripWrappedString', function() {
    const opts = {
      // openStr: '(((', closeStr: ')))'
    }
    const word = 'hi world'
    const wrapped = wrapString(word, opts)
    expect(stripWrappedString(wrapped, opts)).toBe(word)
  })

  it('should wrapString & stripWrappedString nested', function() {
    const opts = {
      // openStr: '(((', closeStr: ')))'
    }
    const word = `hi world ${wrapString('cuttle', opts)}`
    const wrapped = wrapString(word, opts)
    expect(stripWrappedString(wrapped, opts)).toBe('hi world cuttle')
  })

  it('should wrapString & stripWrappedString nested with hidden data', function() {
    const opts = {
      openStr: '(',
      closeStr: ')'
    }
    const sep = '\u200f'
    const wrapped =
      'haha ' +
      wrapString(
        `hi world ${wrapString('cuttle' + sep + encode('hide cuttle'), opts)}${sep}${encode('hide hi world')}`,
        opts
      ) +
      ' haha'

    const dataList = []
    expect(
      stripWrappedString(wrapped, {
        ...opts,
        transform: chunk => {
          const pos = chunk.split('').lastIndexOf(sep)
          if (pos >= 0) {
            dataList.push(decode(chunk.slice(pos + 1)))
            return chunk.slice(0, pos)
          }
          return chunk
        }
      })
    ).toBe('haha hi world cuttle haha')
    expect(dataList).toEqual(['hide cuttle', 'hide hi world'])
  })

  it('should wrapString & stripWrappedString nested and concat with hidden data', function() {
    const opts = {
      // openStr: '(',
      // closeStr: ')'
    }
    const sep = '\u200f'
    const wrappedChunk = wrapString(
      `hi world ${wrapString('cuttle' + sep + encode('hide cuttle'), opts)}${sep}${encode('hide hi world')}`,
      opts
    )
    const wrapped = 'haha ' + wrappedChunk + wrappedChunk + ' haha'

    const dataList = []
    expect(
      stripWrappedString(wrapped, {
        ...opts,
        transform: chunk => {
          const pos = chunk.split('').lastIndexOf(sep)
          if (pos >= 0) {
            dataList.push(decode(chunk.slice(pos + 1)))
            return chunk.slice(0, pos)
          }
          return chunk
        }
      })
    ).toBe('haha hi world cuttlehi world cuttle haha')
    expect(dataList).toEqual(['hide cuttle', 'hide hi world', 'hide cuttle', 'hide hi world'])
  })

  it('should wrapString & stripWrappedString concat with hidden data', function() {
    const opts = {
      openStr: '(',
      closeStr: ')'
    }
    const sep = '\u200f'
    const wrappedChunk = wrapString(
      `hi world ${wrapString('cuttle' + sep + encode('hide cuttle'), opts)}${sep}${encode('hide hi world')}`,
      opts
    )
    const wrapped = 'haha ' + wrappedChunk + wrappedChunk + ' haha'

    const dataList = []
    expect(
      stripWrappedString(wrapped, {
        ...opts,
        transform: (chunk, {closeStr, openStr}) => {
          const pos = chunk.split('').lastIndexOf(sep)
          if (pos >= 0) {
            dataList.push(decode(chunk.slice(pos + 1)))
            return openStr + chunk.slice(0, pos) + closeStr
          }
          return openStr + chunk + closeStr
        }
      })
    ).toBe('haha (hi world (cuttle))(hi world (cuttle)) haha')
    expect(dataList).toEqual(['hide cuttle', 'hide hi world', 'hide cuttle', 'hide hi world'])
  })

  it('should wrapString & stripWrappedString', function() {
    const opts = {
    }
    expect(
      stripWrappedString('normal string', {
        ...opts
      })
    ).toBe('normal string')
  })

  it('should mergeWrappedStringLinked nested and concat with hidden data', function() {
    const opts = {
    }
    const sep = '\u200f'
    const wrappedChunk = wrapString(
      `hi world ${wrapString('cuttle' + sep + encode('hide cuttle'), opts)}${sep}${encode('hide hi world')}`,
      opts
    )
    const wrapped = 'haha ' + wrappedChunk + wrappedChunk + ' haha'

    const dataList = []
    console.log(mergeWrappedStringLinked(wrapped, {
      ...opts,
      transform: chunk => {
        const pos = chunk.split('').lastIndexOf(sep)
        if (pos >= 0) {
          dataList.push(decode(chunk.slice(pos + 1)))
          return chunk.slice(0, pos)
        }
        return chunk
      }
    }).toArray())
    // expect(
    //   mergeWrappedStringLinked(wrapped, {
    //     ...opts,
    //     transform: chunk => {
    //       const pos = chunk.split('').lastIndexOf(sep)
    //       if (pos >= 0) {
    //         dataList.push(decode(chunk.slice(pos + 1)))
    //         return chunk.slice(0, pos)
    //       }
    //       return chunk
    //     }
    //   }).toArray()
    // ).toMatchSnapshot()
    expect(dataList).toEqual(['hide cuttle', 'hide hi world', 'hide cuttle', 'hide hi world'])
  })


  it('should parseWrappedStringLinkedList', function() {
    let linked = parseWrappedStringLinkedList(`xx(((A)B)C((CD()`, {
      openStr: '(',
      closeStr: ')',
      allowEmptyContent: false
    })
    expect(linked.toArray()).toEqual([
      { content: 'xx(', type: 'text' },
      { content: '(', type: 'open' },
      { content: '(', type: 'open' },
      { content: 'A', type: 'text' },
      { content: ')', type: 'close' },
      { content: 'B', type: 'text' },
      { content: ')', type: 'close' },
      { content: 'C((CD()', type: 'text' }
    ])

    linked = parseWrappedStringLinkedList(`()xx(((A)B)C((CD()`, { openStr: '(', closeStr: ')' })
    expect(linked.toArray()).toEqual([
      { content: '(', type: 'open' },
      { content: ')', type: 'close' },
      { content: 'xx(', type: 'text' },
      { content: '(', type: 'open' },
      { content: '(', type: 'open' },
      { content: 'A', type: 'text' },
      { content: ')', type: 'close' },
      { content: 'B', type: 'text' },
      { content: ')', type: 'close' },
      { content: 'C((CD', type: 'text' },
      { content: '(', type: 'open' },
      { content: ')', type: 'close' }
    ])
  })
})
