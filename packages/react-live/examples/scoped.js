/** @jsx createElement */
import '../src/style.less'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { withTinyI18n, I18nProvider } from '@rcp/use.i18ncontext'

import { createReactI18nLive } from '../src'

import { createIsolateI18n } from 'tiny-i18n'

const { tinyI18n, transaction, createElement, configure } = createReactI18nLive({tinyI18n: createIsolateI18n()})
configure({
  enabled: true
})
const { setDictionary, getLanguages, getCurrentLanguage, i18n, getDictionary } = tinyI18n

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

        <div title={i18n('hi') + ',' + i18n('tpl.name', i18n('cong'))}>
          {'Hover me! [translated words in title attribute] (The nested and concat case)'}
        </div>
        {/*TODO BUG*/
        /*<div title={i18n('hi') + ',' + i18n('say.hi', i18n('tpl.name', i18n('cong')))}>{'Change my title attribute (The nested and concat case)'}</div>*/}
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
