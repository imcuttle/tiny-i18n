const CODE_GAP = 9
const MIN_NUM_CODE = '0'.charCodeAt(0)
const MAX_NUM_CODE = '0'.charCodeAt(0) + CODE_GAP
const MIN_LETTER_CODE = 'a'.charCodeAt(0)

const TABLE = [
  '\u200c',
  '\u200b',
  '\u200d',
  '\u2060',
  '\u2061',
  '\u2062',
  '\u2063',
  '\u2064',
  '\u2065',
  '\u2066',
  '\u2067',
  '\u2068',
  '\u2069'
]
// const TABLE = ['1', '2', '3', '4', '5']
const SEP_CHAR = '\u200e'
// const SEP_CHAR = '*'

export const charEncode = (ch, table) => {
  const code = ch.charCodeAt(0)
  if (code >= MIN_NUM_CODE && code <= MAX_NUM_CODE) {
    return table[code - MIN_NUM_CODE]
  }
  return table[CODE_GAP + 1 + code - MIN_LETTER_CODE]
}

export function encode(string, { sepChar = SEP_CHAR, table = TABLE } = {}) {
  let encodedArray = []
  for (let s of string) {
    // UTF-16代码
    let chunk = ''
    for (let char of s.codePointAt(0).toString(table.length)) {
      chunk += charEncode(char, table)
    }
    encodedArray.push(chunk)
  }
  return encodedArray.join(sepChar)
}

export function decode(encoded, { sepChar = SEP_CHAR, table = TABLE } = {}) {
  const points = []
  for (let chunk of encoded.split(sepChar)) {
    let code = 0
    let unit = Math.pow(table.length, chunk.length - 1)
    for (const char of chunk) {
      const bitCode = table.indexOf(char)
      if (bitCode >= 0) {
        code += bitCode * unit
      } else {
        code += char.codePointAt(0) * unit
      }
      unit /= table.length
    }
    chunk.length && points.push(code)
  }
  return String.fromCodePoint(...points)
}
