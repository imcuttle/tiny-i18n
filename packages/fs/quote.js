// Forked from https://github.com/substack/jsonify/blob/master/lib/stringify.js
const escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g
const singleEscapable = /[\\\'\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g
const commonMeta = {
  // table of character substitutions
  '\b': '\\b',
  '\t': '\\t',
  '\n': '\\n',
  '\f': '\\f',
  '\r': '\\r',
  '\\': '\\\\'
}
const doubleMeta = {
  ...commonMeta,
  '"': '\\"'
}
const singleMeta = {
  ...commonMeta,
  "'": "\\'"
}

function _quote(string, char = '"', reg = escapable, meta) {
  // If the string contains no control characters, no quote characters, and no
  // backslash characters, then we can safely slap some quotes around it.
  // Otherwise we must also replace the offending characters with safe escape
  // sequences.
  reg.lastIndex = 0
  return reg.test(string)
    ? char +
        string.replace(reg, function(a) {
          const c = meta[a]
          return typeof c === 'string'
            ? c
            : // : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4)
              a
        }) +
        char
    : char + string + char
}

/**
 * Uses single quote to wrap string.
 * @param string
 * @return {string}
 */
function single(string) {
  return _quote(string, "'", singleEscapable, singleMeta)
}

/**
 * Uses double quote to wrap string.
 * @param string
 * @return {string}
 */
function double(string) {
  return _quote(string, '"', escapable, doubleMeta)
}

module.exports = {
  single,
  double
}
