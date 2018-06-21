/**
 * @file replace
 * @author Cuttle Cong
 * @date 2018/6/21
 * @description
 */
const index = require('fs')
const nps = require('path')
const pify = require('pify')

const rp = require('./replace')

function requireNoCache(modulePath) {
  const data = require(modulePath)
  modulePath = require.resolve(modulePath)

  if (require.cache[modulePath]) {
    const { children } = require.cache[modulePath]
    delete require.cache[modulePath]
    children.forEach(({ id }) => delete require.cache[id])
  }
  return data
}

class Fs {
  constructor(i18nRoot, options) {
    this.i18nRoot = nps.resolve(i18nRoot)
    this.options = options || {}
  }

  getLanguages() {
    return pify(index.readdir)(this.i18nRoot).then(files =>
      files.map(filename => filename.replace(/\.[^.]+$/, '')).filter(filename => !filename.startsWith('.'))
    )
  }

  getWordSync(key, lang) {
    const data = this.getDictSync(lang)
    return data && data[key]
  }

  getDictSync(lang) {
    return requireNoCache(this._getFile(lang))
  }

  _getFile(lang) {
    try {
      return require.resolve(nps.join(this.i18nRoot, lang))
    } catch (e) {
      if (e && e.code === 'MODULE_NOT_FOUND') {
        throw new Error('[tiny-i18n fs] The language: ' + lang + ' is not found.')
      }
      throw e
    }
  }

  update(key, value, lang, options) {
    return rp.overwrite(this._getFile(lang), key, value, this.getDictSync(lang), { ...this.options, options })
  }
}
module.exports = Fs
