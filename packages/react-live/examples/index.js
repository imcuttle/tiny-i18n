/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/6/19
 * @description
 */

import { setDictionary, getLanguages, getCurrentLanguage, i18n } from 'tiny-i18n'
import '../register'
import { Provider, inject } from '../'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import '../src/style.less'

setDictionary(
  {
    hi: '你好',
    cong: '聪',
    'say.hi': '你好呀, ${1}同学'
  },
  'zh-CN'
)

setDictionary(
  {
    hi: 'hi',
    cong: 'Cong',
    'say.hi': 'Hi, ${1} .'
  },
  'en-US'
)

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
          <button key={lang} onClick={this.changeLanguage.bind(this, lang)}>Change Language to {lang}</button>
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
  <Provider>
    <View />
  </Provider>,
  window.root
)
