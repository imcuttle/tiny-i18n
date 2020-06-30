/**
 * @file Provider
 * @author Cuttle Cong
 * @date 2018/6/19
 * @description
 */

import React from 'react'

import defaultTinyI18n from './defaultTinyI18n'

function useForceUpdate() {
  const [v, set] = React.useState(1)
  const update = React.useCallback(() => {
    set(v => v + 1)
  }, [])
  return [v, update]
}

export default function createProviderContext(tinyI18n = { ...defaultTinyI18n }) {
  const ReactI18nLiveContext = React.createContext({
    i18n: {}
  })

  const wrapFn = (fn, forceUpdate) => {
    if (!fn) {
      return fn
    }
    return (...argv) => {
      const result = fn(...argv)
      forceUpdate()
      return result
    }
  }

  const ReactI18nLiveProvider = React.memo(function({ children }) {
    const [v, forceUpdate] = useForceUpdate()

    const memoValue = React.useMemo(
      () => {
        return {
          ...tinyI18n,
          origin: tinyI18n,
          setLanguage: wrapFn(tinyI18n.setLanguage, forceUpdate),
          extendDictionary: wrapFn(tinyI18n.extendDictionary, forceUpdate),
          setDictionary: wrapFn(tinyI18n.setDictionary, forceUpdate),
        }
      },
      [v, forceUpdate]
    )

    return <ReactI18nLiveContext.Provider value={memoValue}>{children}</ReactI18nLiveContext.Provider>
  })

  const ReactI18nLiveConsumer = ReactI18nLiveContext.Consumer

  function useTinyI18n() {
    return React.useContext(ReactI18nLiveContext)
  }

  function withTinyI18n(Component) {
    return class WithTinyI18n extends React.Component {
      render() {
        return (
          <ReactI18nLiveConsumer>{tinyI18n => <Component tinyI18n={tinyI18n} {...this.props} />}</ReactI18nLiveConsumer>
        )
      }
    }
  }

  return {
    useTinyI18n,
    withTinyI18n,
    ReactI18nLiveConsumer,
    ReactI18nLiveProvider,
    ReactI18nLiveContext
  }
}
