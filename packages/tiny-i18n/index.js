/**
 * @file src
 * @author Cuttle Cong
 * @date 2018/3/1
 * @description
 */
import getLocalLanguage from 'isomorphic-language'

function createIsolateI18n() {
  const database = {}
  let currLanguage = (getLocalLanguage() || '').toLowerCase()

  function assertDictionary(language) {
    if (!getDictionary(language)) {
      throw new Error(`[tiny-i18n] Error: the dictionary of language: ${language} is not existed.`)
    }
  }

  function getCurrentLanguage() {
    return currLanguage.toLowerCase()
  }

  function getLanguages() {
    return Object.keys(database)
  }

  function getDictionary(language = getCurrentLanguage()) {
    return database[language.toLowerCase()]
  }

  function getWord(key, language = getCurrentLanguage()) {
    assertDictionary(language)
    const dictionary = getDictionary(language)
    return dictionary[key]
  }

  function setDictionary(dict, language = getCurrentLanguage()) {
    language = language.toLowerCase()
    database[language] = dict
    return database[language]
  }

  function extendDictionary(dict, language = getCurrentLanguage()) {
    language = language.toLowerCase()
    return setDictionary(
      {
        ...getDictionary(language),
        ...dict
      },
      language
    )
  }

  function setLanguage(language) {
    currLanguage = language
  }

  function i18n(key, ...args) {
    const current = getCurrentLanguage()
    assertDictionary(current)
    const value = getWord(key, current)
    if (typeof value !== 'string') {
      process.env.NODE_ENV !== 'production' && console.error(`[tiny-i18n] Error: the \`${key}\` word is not found in ${current} language.`)
      return `{{${key}}}`
    }
    return value.replace(/\${(\d+)}/g, (_, $1) => {
      return args[parseInt($1) - 1]
    })
  }

  return {
    i18n,
    setDictionary,
    setLanguage,
    getCurrentLanguage,
    getDictionary,
    getLanguages,
    getWord,
    extendDictionary
  }
}

module.exports = {
  ...createIsolateI18n(),
  createIsolateI18n
}
