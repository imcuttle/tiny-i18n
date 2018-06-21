'use strict';

/**
 * @file register
 * @author Cuttle Cong
 * @date 2018/6/19
 * @description
 */
var _require = require('./'),
    wrappedCreateElement = _require.wrappedCreateElement,
    wrappedI18n = _require.wrappedI18n,
    wrappedSetLanguage = _require.wrappedSetLanguage;

if (!global.__TINY_I18N_REACT_LIVE__) {
  require('tiny-i18n').i18n = wrappedI18n;
  require('tiny-i18n').setLanguage = wrappedSetLanguage;
  require('react').createElement = wrappedCreateElement;
}
global.__TINY_I18N_REACT_LIVE__ = true;