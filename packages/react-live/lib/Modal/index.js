'use strict';

exports.__esModule = true;
exports.Footer = exports.Sep = exports.Body = exports.Header = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('../utils'),
    styleUsable = _require.styleUsable,
    isElementOf = _require.isElementOf,
    createSingleElementView = _require.createSingleElementView;

var _styleUsable = styleUsable(require('./style')),
    use = _styleUsable.use,
    unuse = _styleUsable.unuse;

var prefix = 'i18n-modal-';

var emitter = createSingleElementView();
function downHandle(evt) {
  if (evt.target.classList.contains('i18n-modal-header')) {
    // const x = evt.clientX - evt.offsetX - 1
    // const y = evt.clientY - evt.offsetY - 1
    var _getBoundingClientRec = this.getBoundingClientRect(),
        left = _getBoundingClientRec.left,
        top = _getBoundingClientRec.top;

    this.style.left = left + 'px';
    this.style.top = top + 'px';
    this.style.marginLeft = '0px';
    this.style.transform = 'none';

    this.pos = {
      x: evt.clientX || evt.touches[0].clientX,
      y: evt.clientY || evt.touches[0].clientY
    };
  }
}
function moveHandle(evt) {
  if (evt.buttons || evt.type === 'touchmove') {
    if (this.pos /*evt.target.classList.contains('i18n-modal-header')*/) {
        var clientX = evt.clientX || evt.touches[0].clientX;
        var clientY = evt.clientY || evt.touches[0].clientY;
        var dx = clientX - this.pos.x;
        var dy = clientY - this.pos.y;
        this.pos = { x: clientX, y: clientY };

        var _getBoundingClientRec2 = this.getBoundingClientRect(),
            left = _getBoundingClientRec2.left,
            top = _getBoundingClientRec2.top;

        this.style.left = left + dx + 'px';
        this.style.top = top + dy + 'px';
      }
  } else {
    this.pos = null;
  }
}

var Header = exports.Header = function Header(_ref) {
  var children = _ref.children,
      onClose = _ref.onClose;
  return _react2.default.createElement(
    'div',
    { className: prefix + 'header' },
    children,
    _react2.default.createElement(
      'div',
      { className: prefix + 'header-buttons' },
      _react2.default.createElement(
        'span',
        { onClick: onClose, title: 'Ctrl/Cmd + ]', className: prefix + 'header-btn close-btn' },
        '\xD7'
      )
    )
  );
};

var Body = exports.Body = function Body(_ref2) {
  var children = _ref2.children;
  return _react2.default.createElement(
    'div',
    { className: prefix + 'body' },
    children
  );
};

var Sep = exports.Sep = function Sep(_ref3) {
  var color = _ref3.color,
      style = _ref3.style;
  return _react2.default.createElement('div', {
    className: prefix + 'sep',
    style: _extends({ backgroundColor: color }, style)
  });
};

var Footer = exports.Footer = function Footer(_ref4) {
  var children = _ref4.children;
  return _react2.default.createElement(
    'div',
    { className: prefix + 'footer' },
    children
  );
};

Object.assign(module.exports, emitter, {
  open: function open(props, attributes, mountDOM) {
    // element, attributes, mountDOM = document.body
    var dom = emitter.open(_react2.default.createElement(Modal, _extends({ onClose: emitter.close }, props, { visible: true })), _extends({}, attributes, { className: prefix + 'wrap' }), mountDOM);

    document.body.removeEventListener('mousemove', emitter.moveHandle);
    document.body.removeEventListener('mousedown', emitter.downHandle);

    document.body.removeEventListener('touchstart', emitter.downHandle);
    document.body.removeEventListener('touchmove', emitter.moveHandle);

    emitter.moveHandle = moveHandle.bind(dom);
    emitter.downHandle = downHandle.bind(dom);
    document.body.addEventListener('mousemove', emitter.moveHandle);
    document.body.addEventListener('mousedown', emitter.downHandle);
    document.body.addEventListener('touchstart', emitter.downHandle);
    document.body.addEventListener('touchmove', emitter.moveHandle);
    return dom;
  },
  close: function close() {
    document.body.removeEventListener('mousemove', emitter.moveHandle);
    document.body.removeEventListener('mousedown', emitter.downHandle);

    document.body.removeEventListener('touchstart', emitter.downHandle);
    document.body.removeEventListener('touchmove', emitter.moveHandle);
    return emitter.close.apply(this, arguments);
  }
});

var Modal = function (_React$PureComponent) {
  _inherits(Modal, _React$PureComponent);

  function Modal() {
    _classCallCheck(this, Modal);

    return _possibleConstructorReturn(this, _React$PureComponent.apply(this, arguments));
  }

  Modal.prototype.componentWillMount = function componentWillMount() {
    use();
  };

  Modal.prototype.componentWillUnmount = function componentWillUnmount() {
    unuse();
  };

  Modal.prototype.getSort = function getSort(ele) {
    var value = 0;
    if (isElementOf(Header)(ele)) {
      value = -1;
    } else if (isElementOf(Body)(ele)) {
      value = 0;
    } else if (isElementOf(Footer)(ele)) {
      value = 1;
    }
    return value;
  };

  Modal.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        visible = _props.visible,
        onClose = _props.onClose;

    var children = _react2.default.Children.toArray(this.props.children).sort(function (a, b) {
      return _this2.getSort(a) - _this2.getSort(b);
    });

    if (!visible) {
      return null;
    }

    return _react2.default.createElement(
      'div',
      { className: prefix + 'container' },
      children.map(function (child) {
        if (isElementOf(Header)(child) && onClose) {
          return _react2.default.cloneElement(child, { onClose: onClose });
        }
        return child;
      })
    );
  };

  return Modal;
}(_react2.default.PureComponent);

exports.default = Modal;


Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;
Modal.Sep = Sep;