/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/6/18
 * @description
 */

import createReactI18nLiveCore from './createReactI18nLiveCore'
import createProviderContext from './createProviderContext'
import Transaction from './Transaction'
import defaultTinyI18n from './defaultTinyI18n'

function createReactI18nLive(tinyI18n = { ...defaultTinyI18n }, { transaction, createElement } = {}) {
  const core = createReactI18nLiveCore({
    tinyI18n,
    transaction,
    createElement
  })

  return {
    ...core,
    ...createProviderContext(core.tinyI18n)
  }
}

export { Transaction, createProviderContext, createReactI18nLiveCore, createReactI18nLive }

const reactI18nLive = createReactI18nLive()

export default reactI18nLive
