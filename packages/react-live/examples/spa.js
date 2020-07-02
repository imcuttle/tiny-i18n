/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/6/19
 * @description
 */
import '../src/style.less'
import { use, unuse } from '../src/register'
import reactI18nLive from '../src'
import { I18nProvider, withTinyI18n } from '@rcp/use.i18ncontext'

import tinyI18n from 'tiny-i18n'
const { setDictionary, getLanguages, getCurrentLanguage, i18n, getDictionary } = tinyI18n

import * as React from 'react'
import * as ReactDOM from 'react-dom'

const { transaction, configure, getSetting } = reactI18nLive
let zhDict = require('./dict/zh-CN')
let enDict = require('./dict/en-US')

transaction.setConfig({
  fetchWord(data) {
    console.log('fetchWord', data)
    return fetch(`/i18n/word` , {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        return json.data
      })
    // word
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
  componentDidUpdate(prevProps, prevState, snapshot) {
    document.title = '哈哈' + i18n('cong')
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
        <div title={i18n('hi') + ',' + i18n('say.hi', i18n('tpl.name', i18n('cong')))}>
          {'Change my title attribute (The nested and concat case)'}
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <I18nProvider tinyI18n={tinyI18n}>
    <View />
  </I18nProvider>,
  window.root
)
