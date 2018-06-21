'use strict';

exports.__esModule = true;
exports.wrapped_unhighlight_createElement = exports.wrappedCreateElement = exports.createElement = exports.i18n = exports.transaction = exports.inject = exports.Provider = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * @file index
                                                                                                                                                                                                                                                                   * @author Cuttle Cong
                                                                                                                                                                                                                                                                   * @date 2018/6/18
                                                                                                                                                                                                                                                                   * @description
                                                                                                                                                                                                                                                                   */

var _Provider = require('./Provider');

Object.defineProperty(exports, 'Provider', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Provider).default;
  }
});

var _injectI18n = require('./inject-i18n');

Object.defineProperty(exports, 'inject', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_injectI18n).default;
  }
});

var _transaction = require('./transaction');

Object.defineProperty(exports, 'transaction', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_transaction).default;
  }
});
exports.wrappedI18n = wrappedI18n;
exports.wrappedSetLanguage = wrappedSetLanguage;

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _Badge = require('./Badge');

var _domUtils = require('./dom-utils');

var _index = require('./Modal/index');

var _ModalContent = require('./Modal/ModalContent');

var _ModalContent2 = _interopRequireDefault(_ModalContent);

var _utils = require('./utils');

var _transaction2 = _interopRequireDefault(_transaction);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var tinyI18n = require('tiny-i18n');

var pureCreateElement = React.createElement;
var pureI18n = tinyI18n.i18n,
    getWord = tinyI18n.getWord,
    setLanguage = tinyI18n.setLanguage,
    extendDictionary = tinyI18n.extendDictionary,
    getCurrentLanguage = tinyI18n.getCurrentLanguage,
    getDictionary = tinyI18n.getDictionary;


var badge = (0, _utils.createSingleElementView)();
(0, _utils.proxy)(badge, 'open', function (open) {
  return function (props, attributes, mountDom) {
    return open(React.createElement(_Badge.BadgeInner, props), attributes, mountDom);
  };
});

var i18n = exports.i18n = pureI18n;
// export const setLanguage = pureI18n
var createElement = exports.createElement = pureCreateElement;

// Overwrites `tinyI18n.i18n` for inject some data.
function wrappedI18n(key) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var argumentArray = [].slice.call(arguments);

  var maxLev = 0;
  argumentArray.forEach(function (arg) {
    maxLev = Math.max((0, _utils.getMaxLevel)(String(arg)), maxLev);
  });

  return (0, _utils.toWrappedString)(JSON.stringify(argumentArray), 1 + maxLev);
}

function makeWrappedCreateElement(highlight) {
  return function wrappedCreateElement(type, config) {
    for (var _len2 = arguments.length, children = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      children[_key2 - 2] = arguments[_key2];
    }

    var keyListContainer = [];
    var pathMapContainer = {};

    var argsGetterList = [];
    var translatedGetterList = [];
    function handleTranslatedString(string, path) {
      var list = [];

      var maxLev = 1;
      function recursiveStrip(string) {
        return (0, _utils.strip)(string, function (str, level) {
          var data = JSON.parse(str);
          if (!isNaN(level)) {
            level = parseInt(level);
          } else {
            level = 1;
          }

          maxLev = Math.max(level, maxLev);
          list.push(data);

          // Supports nested case when updating dom
          // eg. i18n('abc', i18n('hhh'))

          // Strips the outermost wrapper
          function translatedGetter(key, argsGetter) {
            var lang = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : getCurrentLanguage();

            var data = [key].concat(argsGetter(lang));
            var old = getCurrentLanguage();
            tinyI18n.setLanguage(lang);
            var rlt = (0, _utils.rStrip)(pureI18n.apply(null, data), function (s, a, b, c, count) {
              var data = JSON.parse(s);
              return (0, _utils.toWrappedString)(translatedGetter(data[0], function () {
                return data.slice(1);
              }, lang), void 0, count);
            }, level - 1);
            tinyI18n.setLanguage(old);
            return rlt;
          }
          // Strips the outermost wrapper
          function argsGetter(args, lang) {
            return args.map(function (arg) {
              return (0, _utils.rStrip)(String(arg), function (s, a, b, c, count) {
                var data = JSON.parse(s);
                return (0, _utils.toWrappedString)(translatedGetter(data[0], function () {
                  return data.slice(1);
                }, lang), void 0, count);
              }, level - 1);
            });
          }
          var cloneData = JSON.parse(str);
          var eachArgsGetter = argsGetter.bind(null, cloneData.slice(1));
          argsGetterList.push(eachArgsGetter);
          translatedGetterList.push(translatedGetter.bind(null, cloneData[0], eachArgsGetter));

          if (data) {
            // Parse recursive args
            // eg.  _i('abc', _i('jjj'))
            data.splice.apply(data, [1, data.length - 1].concat(data.slice(1).map(function (arg) {
              return recursiveStrip(String(arg));
            })));
          }
          var rlt = pureI18n.apply(null, data);
          // Repeats wrapping open/close char
          // eg. [x][x]Hi,([x]lala[y])[y][y]
          if (highlight) {
            return (0, _utils.toWrappedString)(rlt, void 0, level);
          }
          return rlt;
        });
      }

      var striped = recursiveStrip(string);
      list.forEach(function (_ref) {
        var id = _ref[0],
            args = _ref.slice(1);

        if (!keyListContainer.includes(id)) {
          keyListContainer.push(id);
        }

        pathMapContainer[id] = pathMapContainer[id] || [];
        var pathMap = pathMapContainer[id];
        !pathMap.includes(path) && pathMap.push([path, maxLev]);
      });

      return striped;
    }

    // Render html markup
    if (typeof type === 'string') {
      children = children.map(function (node, index) {
        if (typeof node === 'string') {
          return handleTranslatedString(node, 'children[' + index + ']');
        }
        return node;
      });

      config = config || {};
      config = _extends({}, config);
      var keyList = Object.keys(config);
      keyList.forEach(function (configKey) {
        var node = config[configKey];
        if (typeof node === 'string') {
          config[configKey] = handleTranslatedString(node, configKey);
        }
      });
    }

    // Contains translated property and child.
    if (highlight && !!keyListContainer.length) {
      config['data-i18n-keylist'] = JSON.stringify(keyListContainer);
      // config['data-i18n-argslist'] = JSON.stringify(argsListContainer)
      config['data-i18n-pathmap'] = JSON.stringify(pathMapContainer);

      (0, _utils.proxy)(config, 'onMouseEnter', function (_onMouseEnter) {
        return function onMouseEnter(_ref2) {
          var _this = this;

          var target = _ref2.target;

          badge.close();
          var ctx = {};
          // function getTranslatedList() {
          //   return translatedGetterList.map(cb => cb())
          // }
          // function getArgsList() {
          //   return argsGetterList.map(cb => cb())
          // }
          var content = React.createElement(_ModalContent2.default, {
            onClose: _domUtils.unHighlightActiveBadge,
            onActiveUpdate: function onActiveUpdate(newId, oldId) {
              (0, _domUtils.unHighlightActiveBadge)();
              (0, _domUtils.highlightActiveBadge)(newId);
            },
            ref: function ref(_ref4) {
              return ctx.content = _ref4;
            },
            keyList: keyListContainer
            // argsList={getArgsList()}
            , translatedGetterList: translatedGetterList,
            argsGetterList: argsGetterList,
            inputValueList: keyListContainer.map(function (key) {
              return getWord(key);
            }),
            onSave: function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(data) {
                var passed, _extendDictionary, index;

                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _transaction2.default.update({
                          id: data.data.id,
                          value: data.value
                        });

                      case 2:
                        passed = _context.sent;

                        if (passed) {
                          extendDictionary((_extendDictionary = {}, _extendDictionary[data.data.id] = data.value, _extendDictionary), ctx.content.lang);
                          index = ctx.content.state.index;

                          if (ctx.content.lang === getCurrentLanguage()) {
                            (0, _domUtils.updateDOM)(target, data.data.id, data.data.raw, pureI18n.apply(null, [data.data.id].concat(argsGetterList[index](ctx.content.lang))));
                          }

                          ctx.content.forceUpdate();
                          _transaction2.default.emit('afterUpdate', _extends({ lang: ctx.content.lang }, data));
                        }

                      case 4:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this);
              }));

              return function (_x2) {
                return _ref3.apply(this, arguments);
              };
            }()
          });
          var dom = badge.open({
            onClick: function onClick() {
              (0, _index.open)({ children: content });
            }
          });

          var _getOffset = (0, _utils.getOffset)(target),
              top = _getOffset.top,
              left = _getOffset.left;

          Object.assign(dom.style, {
            position: 'absolute',
            top: top + 'px',
            left: left + 'px',
            zIndex: 999999
          });

          if (typeof _onMouseEnter === 'function') {
            return _onMouseEnter.apply(this, arguments);
          }
        };
      });
    }

    return pureCreateElement.apply(this, [type, config].concat(children));
  };
}

// Overwrites `React.createElement` for highlighting translated words.
var wrappedCreateElement = exports.wrappedCreateElement = makeWrappedCreateElement(true);

function wrappedSetLanguage(language) {
  _transaction2.default.register(language);
  return setLanguage.apply(this, arguments);
}

// Used in ModalContent
var wrapped_unhighlight_createElement = exports.wrapped_unhighlight_createElement = makeWrappedCreateElement(false);