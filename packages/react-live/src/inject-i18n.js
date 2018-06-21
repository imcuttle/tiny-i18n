/**
 * @file inject-i18n
 * @author Cuttle Cong
 * @date 2018/6/19
 * @description
 */
import * as PropTypes from 'prop-types'

function isStateless(component) {
  // `function() {}` has prototype, but `() => {}` doesn't
  // `() => {}` via Babel has prototype too.
  return !(component.prototype && component.prototype.render)
}

export default function inject(component) {
  let displayName =
    'Inject-' +
    (component.displayName || component.name || (component.constructor && component.constructor.name) || 'Unknown')

  if (isStateless(component)) {
    process.env.NODE_ENV !== 'production' && console.error(
      '[tiny-i18n (react-live)] Error: `' +
        displayName +
        '` is an stateless Component. but `inject` requires an react class component.'
    )
    return component
  }

  return class Injected extends component {
    static displayName = displayName
    static contextTypes = {
      i18n: PropTypes.object,
      ...component.contextTypes
    }
  }
}
