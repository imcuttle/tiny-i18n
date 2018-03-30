'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * @file src
                                                                                                                                                                                                                                                                   * @author Cuttle Cong
                                                                                                                                                                                                                                                                   * @date 2018/3/1
                                                                                                                                                                                                                                                                   * @description
                                                                                                                                                                                                                                                                   */


exports.getDictionary = getDictionary;

var _isomorphicLanguage = require('isomorphic-language');

var _isomorphicLanguage2 = _interopRequireDefault(_isomorphicLanguage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var database = {};
var currLanguage = (0, _isomorphicLanguage2.default)();

function getCurrentLanguage() {
  return currLanguage;
}

function getDictionary(language) {
  return database[language];
}

function setDictionary(language, dict) {
  database[language] = dict;
  return database[language];
}

function extendDictionary(language, dict) {
  return setDictionary(language, _extends({}, getDictionary(language), dict));
}

function setLanguage(language) {
  currLanguage = language;
}

function i18n(key) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var currentLang = getCurrentLanguage();
  var dict = database[currentLang];
  if (!dict) {
    throw new Error('[tiny-i18n] Error: the dictionary of language: ' + currentLang + ' is empty.');
  }
  var value = dict[key];
  if (typeof value !== 'string') {
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
  extendDictionary: extendDictionary
};
