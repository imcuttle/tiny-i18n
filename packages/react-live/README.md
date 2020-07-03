# @tiny-i18n/react-live

[![NPM version](https://img.shields.io/npm/v/@tiny-i18n/react-live.svg?style=flat-square)](https://www.npmjs.com/package/@tiny-i18n/react-live)
[![NPM Downloads](https://img.shields.io/npm/dm/@tiny-i18n/react-live.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/@tiny-i18n/react-live)

The magical effect making tiny-i18n could be used easily and edit live in react.

[A demo](https://imcuttle.github.io/tiny-i18n/) and [video](http://obu9je6ng.bkt.clouddn.com/Jietu20180622-102135-HD.mp4) created by react and using edit-live.

## Usage

```bash
npm install @tiny-i18n/react-live tiny-i18n
```

- entry.js (the frontend's start point)

```javascript
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import '@tiny-i18n/react-live/lib/style.css'
import { withTinyI18n, I18nProvider } from '@rcp/use.i18ncontext'

import { createReactI18nLive } from '@tiny-i18n/react-live'

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
```

## Examples

```bash
# The Demo in `examples/` which could edit i18n word in live.
npm run example
```
