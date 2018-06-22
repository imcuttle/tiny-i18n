/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/6/19
 * @description
 */
import '../register'
import '../lib/style.less'

import { transaction } from '../'
import { setDictionary, getLanguages, getCurrentLanguage, i18n, getDictionary } from 'tiny-i18n'
import { Provider, inject } from '../'

import * as React from 'react'
import * as ReactDOM from 'react-dom'

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
    }).then(res => res.json())
      .then(json => {
        console.log(json)
      })
  }
})
transaction
  .on('error', e => {
    console.error('error', e)
  })

setDictionary(zhDict, 'zh-CN')

setDictionary(enDict, 'en-US')

@inject
class View extends React.Component {
  changeLanguage = lang => {
    this.context.i18n.setLanguage(lang)
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
  <Provider>
    <View />
  </Provider>,
  window.root
)
