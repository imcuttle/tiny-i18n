/**
 * @file src
 * @author Cuttle Cong
 * @date 2018/3/1
 * @description
 */
import getLocalLanguage from 'isomorphic-language'
const database = {}
let currLanguage = getLocalLanguage()

function getCurrentLanguage() {
  return currLanguage
}

export function getDictionary(language) {
  return database[language]
}

function setDictionary(language, dict) {
  database[language] = dict
  return database[language]
}

function extendDictionary(language, dict) {
  return setDictionary(language, {
    ...getDictionary(language),
    ...dict
  })
}

function setLanguage(language) {
  currLanguage = language
}

function i18n(key, ...args) {
  const currentLang = getCurrentLanguage()
  const dict = database[currentLang]
  if (!dict) {
    throw new Error(`[tiny-i18n] Error: the dictionary of language: ${currentLang} is empty.`)
  }
  let value = dict[key]
  if (typeof value !== 'string') {
    return `{{${key}}}`
  }
  return value.replace(/\${(\d+)}/g, (_, $1) => {
    return args[parseInt($1) - 1]
  })
}

module.exports = {
  i18n: i18n,
  setDictionary: setDictionary,
  setLanguage: setLanguage,
  getCurrentLanguage: getCurrentLanguage,
  getDictionary: getDictionary,
  extendDictionary: extendDictionary
}
