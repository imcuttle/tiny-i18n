'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file Provider
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author Cuttle Cong
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2018/6/19
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @description
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ti = require('tiny-i18n');

var Provider = function (_React$Component) {
  _inherits(Provider, _React$Component);

  function Provider() {
    _classCallCheck(this, Provider);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  /**
   * Wraps each function for update children components
   */
  Provider.prototype.wrapFunction = function wrapFunction(getter) {
    var func = getter();
    var self = this;
    if (typeof func === 'function') {
      return function () {
        // Cancelled: Use getter for syncing i18n.setLanguage
        // func = getter()
        var rlt = func.apply(this, arguments);
        self.forceUpdate();
        return rlt;
      };
    }
    return func;
  };

  Provider.prototype.getChildContext = function getChildContext() {
    var _this2 = this;

    var context = {};
    Object.keys(ti).forEach(function (key) {
      context[key] = _this2.wrapFunction(function () {
        return ti[key];
      });
    });

    return {
      i18n: context
    };
  };

  Provider.prototype.render = function render() {
    return _react2.default.Children.only(this.props.children);
  };

  return Provider;
}(_react2.default.Component);

Provider.propTypes = {};
Provider.defaultProps = {};
Provider.childContextTypes = {
  i18n: _propTypes2.default.object };
exports.default = Provider;