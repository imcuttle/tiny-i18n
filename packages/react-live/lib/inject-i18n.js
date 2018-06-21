'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = inject;

var _propTypes = require('prop-types');

var PropTypes = _interopRequireWildcard(_propTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file inject-i18n
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author Cuttle Cong
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2018/6/19
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @description
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


function isStateless(component) {
  // `function() {}` has prototype, but `() => {}` doesn't
  // `() => {}` via Babel has prototype too.
  return !(component.prototype && component.prototype.render);
}

function inject(component) {
  var _class, _temp;

  var displayName = 'Inject-' + (component.displayName || component.name || component.constructor && component.constructor.name || 'Unknown');

  if (isStateless(component)) {
    process.env.NODE_ENV !== 'production' && console.error('[tiny-i18n (react-live)] Error: `' + displayName + '` is an stateless Component. but `inject` requires an react class component.');
    return component;
  }

  return _temp = _class = function (_component) {
    _inherits(Injected, _component);

    function Injected() {
      _classCallCheck(this, Injected);

      return _possibleConstructorReturn(this, _component.apply(this, arguments));
    }

    return Injected;
  }(component), _class.displayName = displayName, _class.contextTypes = _extends({
    i18n: PropTypes.object
  }, component.contextTypes), _temp;
}