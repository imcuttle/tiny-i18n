'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ = require('../');

var _index = require('./index');

var _transaction = require('../transaction');

var _transaction2 = _interopRequireDefault(_transaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file: ModalContent
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author: Cuttle Cong
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date: 2017/12/20
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @description:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var tinyI18n = require('tiny-i18n');
var getWord = tinyI18n.getWord,
    setLanguage = tinyI18n.setLanguage,
    getLanguages = tinyI18n.getLanguages,
    getCurrentLanguage = tinyI18n.getCurrentLanguage;


var bodyPrefix = 'i18n-modal-body-';

var ModalContent = function (_React$Component) {
  _inherits(ModalContent, _React$Component);

  function ModalContent() {
    var _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, ModalContent);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      keyList: _this.props.keyList,
      argsList: _this.props.argsList,
      // translatedList: this.props.translatedList,
      inputValueList: _this.props.inputValueList || _this.props.translatedList,
      index: _this.props.index,
      fetching: false
    }, _this.handleUpdateLang = function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(lang) {
        var list, _this$state, index, inputValueList, id, str, newValue;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                list = _this.idList;
                _this$state = _this.state, index = _this$state.index, inputValueList = _this$state.inputValueList;
                id = list[index];
                _context.next = 5;
                return _transaction2.default.getLangInfo({ id: id });

              case 5:
                str = _context.sent;

                if (typeof str === 'string' && str) {
                  newValue = inputValueList.slice();

                  newValue[index] = str;
                  _this.setState({
                    inputValueList: newValue
                  });
                }

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this2);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }(), _this.onSave = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(evt) {
        var _this$state2, inputValueList, index, data;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!_this.props.onSave) {
                  _context2.next = 10;
                  break;
                }

                _this$state2 = _this.state, inputValueList = _this$state2.inputValueList, index = _this$state2.index;
                data = {
                  value: inputValueList[index],
                  data: {
                    id: _this.idList[index],
                    args: _this.argsList[index],
                    raw: _this.rawList[index]
                  }
                };

                _this.setState({ fetching: true });
                _context2.prev = 4;
                _context2.next = 7;
                return _this.props.onSave(data);

              case 7:
                _context2.prev = 7;

                _this.setState({ fetching: false });
                return _context2.finish(7);

              case 10:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this2, [[4,, 7, 10]]);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }(), _this.close = function () {
      _this.props.onClose && _this.props.onClose();
      (0, _index.close)();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  ModalContent.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var newState = {};
    if ('value' in nextProps && nextProps.value !== this.state.value) {
      newState.value = nextProps.value;
    }
    if ('index' in nextProps && nextProps.index !== this.state.index) {
      newState.index = nextProps.index;
    }
    this.setState(newState);
  };

  ModalContent.prototype.componentDidMount = function componentDidMount() {
    _transaction2.default.register(this.lang);

    this.handleUpdateLang(this.lang);
    _transaction2.default.addListener('update:lang', this.handleUpdateLang);
    var list = this.idList;
    this.props.onActiveUpdate(list[this.state.index], null);
  };

  ModalContent.prototype.componentWillUnmount = function componentWillUnmount() {
    _transaction2.default.removeListener('update:lang', this.handleUpdateLang);
  };

  ModalContent.prototype.componentDidUpdate = function componentDidUpdate(oldProps, oldState) {
    var list = this.idList;
    if (list[this.state.index] !== oldProps.keyList[oldState.index]) {
      this.handleUpdateLang(this.lang);
      this.props.onActiveUpdate(list[this.state.index], oldProps.keyList[oldState.index]);
    }
  };

  ModalContent.prototype.render = function render() {
    var _this3 = this;

    var _state = this.state,
        index = _state.index,
        inputValueList = _state.inputValueList;
    var idList = this.idList,
        argsList = this.argsList,
        rawList = this.rawList;


    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        _index.Header,
        { onClose: this.close },
        'i18n Edit Live'
      ),
      _react2.default.createElement(
        _index.Body,
        null,
        _react2.default.createElement(
          'div',
          { className: 'i18n-lang-context' },
          getLanguages().map(function (lang) {
            return _react2.default.createElement(
              'button',
              {
                key: lang,
                disabled: _this3.lang === lang,
                className: 'i18n-modal-btn sm',
                onClick: function onClick() {
                  _transaction2.default.register(lang);
                  _this3.handleUpdateLang(lang);
                  _this3.forceUpdate();
                }
              },
              lang
            );
          })
        ),
        _react2.default.createElement(
          'div',
          { className: bodyPrefix + 'info' },
          _react2.default.createElement(
            'div',
            { className: bodyPrefix + 'logo' },
            'i18n Edit Live'
          ),
          _react2.default.createElement(
            'div',
            { className: bodyPrefix + 'key' },
            _react2.default.createElement(
              'span',
              null,
              'Key: '
            ),
            _react2.default.createElement(
              'span',
              null,
              idList[index]
            )
          ),
          argsList[index] && !!argsList[index].length &&
          /*Avoides highlight (arguments) because of overwriting React.createElement */
          (0, _.wrapped_unhighlight_createElement)('div', { className: bodyPrefix + 'key' }, 'Arguments: [' + argsList[index].join(', ') + ']'),
          (0, _.wrapped_unhighlight_createElement)('div', { className: bodyPrefix + 'raw' }, rawList[index])
        ),
        _react2.default.createElement(_index.Sep, null),
        _react2.default.createElement('textarea', {
          autoFocus: true,
          value: inputValueList[index],
          onKeyDown: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(evt) {
              return _regenerator2.default.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      if (!((evt.ctrlKey || evt.metaKey) && evt.keyCode === 'S'.charCodeAt(0))) {
                        _context3.next = 6;
                        break;
                      }

                      evt.preventDefault();
                      evt.stopPropagation();
                      _context3.next = 5;
                      return _this3.onSave();

                    case 5:
                      return _context3.abrupt('return');

                    case 6:
                      if (!((evt.ctrlKey || evt.metaKey) && evt.keyCode === 221)) {
                        _context3.next = 11;
                        break;
                      }

                      _this3.close();
                      evt.preventDefault();
                      evt.stopPropagation();
                      return _context3.abrupt('return');

                    case 11:
                    case 'end':
                      return _context3.stop();
                  }
                }
              }, _callee3, _this3);
            }));

            return function (_x3) {
              return _ref3.apply(this, arguments);
            };
          }(),
          onChange: function onChange(evt) {
            var newValues = inputValueList.slice();
            newValues[index] = evt.target.value;
            _this3.setState({ inputValueList: newValues });
            _this3.props.updateValue && _this3.props.updateValue(newValues);
          },
          rows: 4,
          className: bodyPrefix + 'edit',
          placeholder: 'Enter translation here'
        })
      ),
      _react2.default.createElement(
        _index.Footer,
        null,
        _react2.default.createElement(
          'span',
          { className: '' },
          _react2.default.createElement(
            'button',
            {
              className: 'i18n-modal-btn i18n-icon-left',
              title: 'previous',
              onClick: function onClick() {
                _this3.setState({
                  index: _this3.state.index - 1
                });
              },
              disabled: this.state.index <= 0
            },
            '<'
          ),
          _react2.default.createElement(
            'button',
            {
              className: 'i18n-modal-btn i18n-icon-right',
              title: 'next',
              onClick: function onClick() {
                _this3.setState({
                  index: _this3.state.index + 1
                });
              },
              disabled: this.state.index >= this.idList.length - 1
            },
            '>'
          )
        ),
        _react2.default.createElement(
          'span',
          { className: 'i18n-right' },
          _react2.default.createElement(
            'span',
            null,
            index + 1 + '/' + idList.length
          ),
          _react2.default.createElement(
            'button',
            {
              disabled: this.state.fetching || !inputValueList[index] || inputValueList[index] === getWord(idList[index], this.lang),
              className: 'i18n-modal-btn',
              onClick: this.onSave
            },
            'Save'
          )
        )
      )
    );
  };

  _createClass(ModalContent, [{
    key: 'argsList',
    get: function get() {
      var lang = this.lang;
      var argsGetterList = this.props.argsGetterList;

      return argsGetterList.map(function (getter) {
        return getter(lang);
      });
    }
  }, {
    key: 'idList',
    get: function get() {
      return this.state.keyList;
    }
  }, {
    key: 'rawList',
    get: function get() {
      var lang = this.lang;
      var translatedGetterList = this.props.translatedGetterList;

      return translatedGetterList.map(function (getter) {
        return getter(lang);
      });
    }
  }, {
    key: 'lang',
    get: function get() {
      return _transaction2.default.context.lang || getCurrentLanguage();
    }
  }]);

  return ModalContent;
}(_react2.default.Component);

ModalContent.defaultProps = {
  keyList: [],
  argsList: [],
  // lang => string[]
  argsGetterList: [],
  // lang => string
  translatedGetterList: [],
  // translatedList: [],
  // inputValueList: [],
  index: 0,
  updateValue: function updateValue() {},
  onActiveUpdate: function onActiveUpdate() {}
};
exports.default = ModalContent;