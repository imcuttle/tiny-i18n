/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/6/19
 * @description
 */
import { use, unuse } from '../src/register'
import '../src/style.less'

import reactI18nLive from '../src'
import { setDictionary, getLanguages, getCurrentLanguage, i18n, getDictionary } from 'tiny-i18n'

import * as React from 'react'
import * as ReactDOM from 'react-dom'

const {
  transaction,
  withTinyI18n,
  configure,
  getSetting,
  useTinyI18n,
  ReactI18nLiveProvider,
  ReactI18nLiveConsumer
} = reactI18nLive
let zhDict = require('./dict/zh-CN')
let enDict = require('./dict/en-US')

transaction.setConfig({
  fetchWord(data) {
    console.log('fetchWord', data)
    return false
  },
  fetchUpdate({ lang, key, value }) {
    return fetch('/i18n/update', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ lang, key, value })
    })
      .then(res => res.json())
      .then(json => {
        console.log(json)
      })
  }
})
transaction.on('error', e => {
  console.error('error', e)
})

setDictionary(zhDict, 'zh-CN')
setDictionary(enDict, 'en-US')

@withTinyI18n
class View extends React.Component {
  changeLanguage = lang => {
    this.props.tinyI18n.setLanguage(lang)
  }
  componentWillMount() {
    this.changeLanguage(getLanguages()[0])
  }

  render() {
    return (
      <div>
        <h3>Current Language: {getCurrentLanguage()}</h3>
        <button
          onClick={() => {
            if (getSetting().enabled) {
              unuse()
            } else {
              use()
            }
            this.forceUpdate()
          }}
        >
          {getSetting().enabled ? 'Close' : 'Open'}
        </button>
        {getLanguages().map(lang => (
          <button key={lang} onClick={this.changeLanguage.bind(this, lang)}>
            Change Language to {lang}
          </button>
        ))}
        <div>Im not an i18n text.</div>
        <div>{i18n('hi') + ',' + i18n('cong')}</div>
        <div title={'abc' + i18n('hi') + i18n('cong')}>
          {i18n('hi')},{i18n('cong', i18n('cong', 'hjhjhj'))}
        </div>
        <div title={i18n('say.hi', 'hah')}>{i18n('say.hi', i18n('cong'))}</div>
      </div>
    )
  }
}

ReactDOM.render(
  <ReactI18nLiveProvider>
    <View />
  </ReactI18nLiveProvider>,
  window.root
)
