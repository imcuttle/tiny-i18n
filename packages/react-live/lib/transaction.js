'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file: transaction
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author: Cuttle Cong
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date: 2017/12/20
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @description:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var tinyI18n = require('tiny-i18n');
var getWord = tinyI18n.getWord;

var MyEventEmitter = function (_EventEmitter) {
  _inherits(MyEventEmitter, _EventEmitter);

  function MyEventEmitter() {
    var _temp, _this, _ret;

    _classCallCheck(this, MyEventEmitter);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _EventEmitter.call.apply(_EventEmitter, [this].concat(args))), _this), _this.context = { data: { reqs: [] } }, _this.config = {}, _temp), _possibleConstructorReturn(_this, _ret);
  }

  /**
   *
   * @param config
   * @param config.fetchWord
   * @param config.fetchUpdate
   */
  MyEventEmitter.prototype.setConfig = function setConfig() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.config = config;
  };

  MyEventEmitter.prototype.register = function register(lang) {
    if (this.context.lang !== lang) {
      this.context.lang = lang;
      this.emit('update:lang', lang);
    }
  };

  MyEventEmitter.prototype.getLangInfo = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(extra) {
      var req, data;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!this.config.fetchWord) {
                _context.next = 18;
                break;
              }

              _context.prev = 1;
              req = _extends({ lang: this.context.lang, key: extra.id }, extra);

              delete req.id;
              _context.next = 6;
              return this.config.fetchWord(req);

            case 6:
              data = _context.sent;

              if (!(data === false)) {
                _context.next = 9;
                break;
              }

              return _context.abrupt('return', null);

            case 9:
              this.emit('langInfo', data);
              return _context.abrupt('return', data.toString());

            case 13:
              _context.prev = 13;
              _context.t0 = _context['catch'](1);

              _context.t0.id = 'langInfo';
              this.emit('error', _context.t0);

            case 17:
              return _context.abrupt('return', null);

            case 18:
              return _context.abrupt('return', getWord(extra.id, this.context.lang));

            case 19:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[1, 13]]);
    }));

    function getLangInfo(_x2) {
      return _ref.apply(this, arguments);
    }

    return getLangInfo;
  }();

  MyEventEmitter.prototype.update = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(_ref2) {
      var id = _ref2.id,
          value = _ref2.value,
          _ref2$lang = _ref2.lang,
          lang = _ref2$lang === undefined ? this.context.lang : _ref2$lang;
      var req, data;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              req = { key: id, value: value, lang: lang };

              if (!this.config.fetchUpdate) {
                _context2.next = 16;
                break;
              }

              _context2.prev = 2;
              _context2.next = 5;
              return this.config.fetchUpdate(req);

            case 5:
              data = _context2.sent;

              this.emit('update', data);
              _context2.next = 14;
              break;

            case 9:
              _context2.prev = 9;
              _context2.t0 = _context2['catch'](2);

              _context2.t0.id = 'update';
              this.emit('error', _context2.t0);
              return _context2.abrupt('return', false);

            case 14:
              _context2.next = 17;
              break;

            case 16:
              this.context.data.reqs.push(req);

            case 17:
              return _context2.abrupt('return', true);

            case 18:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this, [[2, 9]]);
    }));

    function update(_x3) {
      return _ref3.apply(this, arguments);
    }

    return update;
  }();

  // async push() {
  //   if (this.config.fetchPush) {
  //     try {
  //       if (this.context.data.reqs.length) {
  //         const data = await this.config.fetchPush(this.context.data.reqs)
  //         this.emit('push', data)
  //         this.context.data.reqs = []
  //       }
  //     } catch (err) {
  //       err.id = 'push'
  //       this.emit('error', err)
  //     }
  //   }
  // }

  return MyEventEmitter;
}(_events2.default);

var main = new MyEventEmitter();
exports.default = main;