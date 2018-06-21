'use strict';

exports.__esModule = true;
exports.BadgeInner = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _index = require('../Modal/index');

var _index2 = _interopRequireDefault(_index);

var _ModalContent = require('../Modal/ModalContent');

var _ModalContent2 = _interopRequireDefault(_ModalContent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('../utils'),
    styleUsable = _require.styleUsable,
    singleView = _require.singleView;

var _styleUsable = styleUsable(require('./style')),
    use = _styleUsable.use,
    unuse = _styleUsable.unuse;

var SingleModal = singleView({ className: 'i18n-modal-wrap' })(_index2.default);

var Badge = function (_React$Component) {
  _inherits(Badge, _React$Component);

  function Badge() {
    var _temp, _this, _ret;

    _classCallCheck(this, Badge);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      hover: false,
      translationValue: ''
    }, _this.onMouseEnter = function (evt) {
      _this.setState({ hover: true });
    }, _this.onMouseLeave = function (evt) {
      _this.setState({ hover: false });
    }, _this.handleClickEdit = function (evt) {
      (0, _index.open)({
        children: _react2.default.createElement(_ModalContent2.default, _extends({}, _this.props, {
          value: _this.state.translationValue,
          updateValue: function updateValue(val) {
            return _this.setState({ translationValue: val });
          }
        }))
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  Badge.prototype.componentWillMount = function componentWillMount() {
    use();
  };

  Badge.prototype.componentWillUnmount = function componentWillUnmount() {
    // unuse()
  };

  Badge.prototype.render = function render() {
    var _props = this.props,
        id = _props.id,
        raw = _props.raw,
        args = _props.args,
        children = _props.children;
    var hover = this.state.hover;


    return _react2.default.createElement(
      'i18n',
      {
        className: 'i18n-badge'
        // data-key={id}
        // data-args={args}
        , onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave
      },
      hover && _react2.default.createElement(BadgeInner, { onClick: this.handleClickEdit }),
      children ? children : raw
    );
  };

  return Badge;
}(_react2.default.Component);

exports.default = Badge;
var BadgeInner = exports.BadgeInner = function BadgeInner(_ref) {
  var onClick = _ref.onClick;
  return _react2.default.createElement('span', { className: 'i18n-badge-inner', onClick: onClick });
};