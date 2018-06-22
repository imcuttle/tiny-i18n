/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/6/19
 * @description
 */
import '../lib/register'
import { setDictionary, getLanguages, getCurrentLanguage, i18n, getDictionary } from 'tiny-i18n'
import { Provider, inject, transaction } from '../'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import '../lib/style.less'

const KEY = 'i18n_'
let zhDict
let enDict
if (localStorage[KEY + 'zh-CN']) {
  zhDict = JSON.parse(localStorage[KEY + 'zh-CN'])
} else {
  zhDict = {
    hi: '你好',
    cong: '聪',
    'tpl.name': '${1}同学',
    'say.hi': '你好呀, ${1}'
  }
}
if (localStorage[KEY + 'en-US']) {
  enDict = JSON.parse(localStorage[KEY + 'en-US'])
} else {
  enDict = {
    hi: 'hi',
    cong: 'Cong',
    'tpl.name': 'Mr ${1}',
    'say.hi': 'Hi, ${1}.'
  }
}

transaction
  .on('afterUpdate', ({ lang }) => {
    const dict = getDictionary(lang)
    if (lang === 'en-US') {
      localStorage[KEY + 'en-US'] = JSON.stringify(dict)
    }
    else {
      localStorage[KEY + 'zh-CN'] = JSON.stringify(dict)
    }
  })
  .on('error', e => {
    console.error('error', e)
  })

setDictionary(zhDict, 'zh-CN')

setDictionary(enDict, 'en-US')

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

        <div>{i18n('hhshshs')}</div>
        {/*TODO BUG*/
        /*<div title={i18n('hi') + ',' + i18n('say.hi', i18n('tpl.name', i18n('cong')))}>{'Change my title attribute (The nested and concat case)'}</div>*/}
      </div>
    )
  }
}

const IView = inject(View)

ReactDOM.render(
  <Provider>
    <IView />
  </Provider>,
  window.root
)
