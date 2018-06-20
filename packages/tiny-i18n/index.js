/**
 * @file src
 * @author Cuttle Cong
 * @date 2018/3/1
 * @description
 */
import getLocalLanguage from 'isomorphic-language'
const database = {}
let currLanguage = getLocalLanguage()

function assertDictionary(language) {
  if (!getDictionary(language)) {
    throw new Error(`[tiny-i18n] Error: the dictionary of language: ${currentLang} is not existed.`)
  }
}

function getCurrentLanguage() {
  return currLanguage
}

function getLanguages() {
  return Object.keys(database)
}

export function getDictionary(language = getCurrentLanguage()) {
  return database[language]
}

export function getWord(key, language = getCurrentLanguage()) {
  assertDictionary(language)
  const dictionary = getDictionary(language)
  return dictionary[key]
}

function setDictionary(dict, language = getCurrentLanguage()) {
  database[language] = dict
  return database[language]
}

function extendDictionary(dict, language = getCurrentLanguage()) {
  return setDictionary({
    ...getDictionary(language),
    ...dict
  }, language)
}

function setLanguage(language) {
  currLanguage = language
}

function i18n(key, ...args) {
  const current = getCurrentLanguage()
  assertDictionary(current)
  const value = getWord(key, current)
  if (typeof value !== 'string') {
    return `{{${key}}}`
  }
  return value.replace(/\${(\d+)}/g, (_, $1) => {
    return args[parseInt($1) - 1]
  })
}

module.exports = {
  i18n,
  setDictionary,
  setLanguage,
  getCurrentLanguage,
  getDictionary,
  getLanguages,
  getWord,
  extendDictionary
}
