'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * @file src
                                                                                                                                                                                                                                                                   * @author Cuttle Cong
                                                                                                                                                                                                                                                                   * @date 2018/3/1
                                                                                                                                                                                                                                                                   * @description
                                                                                                                                                                                                                                                                   */


exports.getDictionary = getDictionary;
exports.getWord = getWord;

var _isomorphicLanguage = require('isomorphic-language');

var _isomorphicLanguage2 = _interopRequireDefault(_isomorphicLanguage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var database = {};
var currLanguage = (0, _isomorphicLanguage2.default)();

function assertDictionary(language) {
  if (!getDictionary(language)) {
    throw new Error('[tiny-i18n] Error: the dictionary of language: ' + language + ' is not existed.');
  }
}

function getCurrentLanguage() {
  return currLanguage;
}

function getLanguages() {
  return Object.keys(database);
}

function getDictionary() {
  var language = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getCurrentLanguage();

  return database[language];
}

function getWord(key) {
  var language = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getCurrentLanguage();

  assertDictionary(language);
  var dictionary = getDictionary(language);
  return dictionary[key];
}

function setDictionary(dict) {
  var language = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getCurrentLanguage();

  database[language] = dict;
  return database[language];
}

function extendDictionary(dict) {
  var language = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getCurrentLanguage();

  return setDictionary(_extends({}, getDictionary(language), dict), language);
}

function setLanguage(language) {
  currLanguage = language;
}

function i18n(key) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var current = getCurrentLanguage();
  assertDictionary(current);
  var value = getWord(key, current);
  if (typeof value !== 'string') {
    process.env.NODE_ENV !== 'production' && console.error('[tiny-i18n] Error: the `' + key + '` word is not found in ' + current + ' language.');
    return '{{' + key + '}}';
  }
  return value.replace(/\${(\d+)}/g, function (_, $1) {
    return args[parseInt($1) - 1];
  });
}

module.exports = {
  i18n: i18n,
  setDictionary: setDictionary,
  setLanguage: setLanguage,
  getCurrentLanguage: getCurrentLanguage,
  getDictionary: getDictionary,
  getLanguages: getLanguages,
  getWord: getWord,
  extendDictionary: extendDictionary
};
