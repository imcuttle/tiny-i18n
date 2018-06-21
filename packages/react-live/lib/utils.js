'use strict';

exports.__esModule = true;
exports.CLOSE_CHAR = exports.OPEN_CHAR = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.toWrappedString = toWrappedString;
exports.getMaxLevel = getMaxLevel;
exports.strip = strip;
exports.rStrip = rStrip;

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file: utils
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author: Cuttle Cong
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date: 2017/12/19
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @description:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var debug = require('debug')('@tiny-i18n/react-live');

exports.styleUsable = function (style) {
  var sty = document.createElement('style');
  var head = document.head || document.getElementsByTagName('head')[0];
  sty.type = 'text/css';
  sty.textContent = style;

  return {
    use: function use() {
      head.appendChild(sty);
    },
    unuse: function unuse() {
      head.removeChild(sty);
    }
  };
};

function createSingleElementView() {
  var container = null;
  var getContainer = function getContainer() {
    var mountDOM = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;
    var attributes = arguments[1];

    if (!container) {
      container = document.createElement('div');
      mountDOM.appendChild(container);
    }
    return Object.assign(container, attributes);
  };

  return {
    close: function close() {
      var dom = getContainer();
      _reactDom2.default.unmountComponentAtNode(dom);
      dom.parentNode.removeChild(dom);
      container = null;
    },
    open: function open(element, attributes) {
      var mountDOM = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.body;

      var dom = getContainer(mountDOM, attributes);
      _reactDom2.default.render(element, dom);
      return dom;
    }
  };
}

exports.createSingleElementView = createSingleElementView;

exports.getOffset = function (el) {
  el = el.getBoundingClientRect();
  return {
    left: el.left + global.scrollX,
    top: el.top + global.scrollY
  };
};

exports.singleView = function (attributes, mountDOM) {
  var center = createSingleElementView();
  function core(Component) {
    return function (_React$Component) {
      _inherits(SingleView, _React$Component);

      function SingleView() {
        _classCallCheck(this, SingleView);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
      }

      SingleView.prototype.componentDidMount = function componentDidMount() {
        center.open(this.comp, attributes, mountDOM);
      };

      SingleView.prototype.componentDidUpdate = function componentDidUpdate() {
        center.open(this.comp, attributes, mountDOM);
      };

      SingleView.prototype.componentWillUnmount = function componentWillUnmount() {
        center.close();
      };

      SingleView.prototype.render = function render() {
        return null;
      };

      _createClass(SingleView, [{
        key: 'comp',
        get: function get() {
          var _props = this.props,
              children = _props.children,
              props = _objectWithoutProperties(_props, ['children']);

          return _react2.default.createElement(
            Component,
            props,
            children
          );
        }
      }]);

      return SingleView;
    }(_react2.default.Component);
  }

  if (typeof attributes === 'function') {
    attributes = {};
    mountDOM = void 0;
    return core();
  }

  return core;
};

exports.isElementOf = function (Component) {
  // Trying to solve the problem with 'children: XXX.isRequired'
  // (https://github.com/gaearon/react-hot-loader/issues/710). This does not work for me :(
  var originalPropTypes = Component.propTypes;
  Component.propTypes = undefined;

  // Well known workaround
  var elementType = _react2.default.createElement(Component, null).type;

  // Restore originalPropTypes
  Component.propTypes = originalPropTypes;

  return function (element) {
    return element && element.type === elementType;
  };
};

exports.proxy = function (ref, name, callback) {
  if (ref) {
    if (callback) {
      ref[name] = callback.call(ref, ref[name]);
    }
  }
};

var OPEN_CHAR = exports.OPEN_CHAR = '\u200B';
var CLOSE_CHAR = exports.CLOSE_CHAR = '\u200C';
function toWrappedString(string) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var repeatCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  return '' + OPEN_CHAR.repeat(repeatCount) + level + string + level + CLOSE_CHAR.repeat(repeatCount);
}

function getReg() {
  var repeatCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

  return new RegExp('[' + OPEN_CHAR + ']{' + repeatCount + '}(\\d?)(.+?)\\1[' + CLOSE_CHAR + ']{' + repeatCount + '}', 'g');
}

function getMaxLevel(string) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var reg = getReg();
  var maxLevel = 0;
  while (reg.test(string)) {
    var $1 = RegExp.$1;

    if (!isNaN($1)) {
      maxLevel = Math.max(maxLevel, parseInt(RegExp.$1));
    }
  }
  return maxLevel;
}

function countString(content, chunk) {
  var count = 0;
  content.replace(new RegExp(chunk, 'g'), function () {
    count++;
  });
  return count;
}

function strip() {
  var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var stripFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (data, l, _) {
    return _;
  };
  var repeatCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  var reg = getReg(repeatCount);
  return string.replace(reg, function (_, level, matched, lastIndex, allString) {
    var restString = allString.slice(lastIndex + _.length);
    var openCount = countString(_, OPEN_CHAR);
    var closeCount = countString(_, CLOSE_CHAR);
    debug('openCount', openCount, _);
    debug('closeCount', closeCount, matched);

    if (openCount !== closeCount) {
      var n = openCount - closeCount;
      var pos = 0;
      // openCount > closeCount
      while (n > 0 && restString[pos] === CLOSE_CHAR) {
        _ += restString[pos];
        matched += restString[pos];
        reg.lastIndex++;
        pos++;
        n--;
      }
    }

    try {
      debug('matched', matched);
      var rlt = stripFn(matched, level, _, lastIndex);
      debug('return string %s.', rlt);
      return rlt;
    } catch (e) {
      return _;
    }
  });
}

function rStrip() {
  var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var stripFn = arguments[1];
  var repeatCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  if (repeatCount <= 0) {
    return string;
  }
  function wrappedStripFn() {
    return stripFn.apply(this, [].concat(Array.prototype.slice.call(arguments)).concat(repeatCount));
  }
  return strip(string, function (string) {
    if (repeatCount - 1 > 0) {
      arguments[0] = rStrip(string, wrappedStripFn, repeatCount - 1);
    }
    return wrappedStripFn.apply(this, arguments);
  }, repeatCount);
}