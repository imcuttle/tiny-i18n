# @tiny-i18n/react-live

[![NPM version](https://img.shields.io/npm/v/@tiny-i18n/react-live.svg?style=flat-square)](https://www.npmjs.com/package/@tiny-i18n/react-live)
[![NPM Downloads](https://img.shields.io/npm/dm/@tiny-i18n/react-live.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/@tiny-i18n/react-live)

The magical effect making tiny-i18n could be used easily and edit live in react.

[A demo](https://imcuttle.github.io/tiny-i18n/) and [video](http://obu9je6ng.bkt.clouddn.com/Jietu20180622-102135-HD.mp4) created by react and using edit-live. 

## Examples

```bash
# The Demo in `examples/` which could edit i18n word in live.
npm run example
```

## Usage

```bash
npm install @tiny-i18n/react-live tiny-i18n
```

- entry.js (the frontend's start point)
```javascript
if (process.env.NODE_ENV !== 'production' && localStorage['i18n-edit-live']) {
  require('@tiny-i18n/react-live/register')
  // Load style
  require('@tiny-i18n/react-live/lib/style.css')
}

// NOTE: Do not use `import` syntax here
// Because `import` would be moved to top level.
// But `@tiny-i18n/react-live/register` should be required firstly.
const { Provider, inject } = require('@tiny-i18n/react-live')

const { setDictionary } = require('tiny-i18n')

setDictionary({
  // ...
}, 'zh-CN')

setDictionary({
  // ...
}, 'en-US')

transaction.setConfig({
  // The fetch method should returns the translated word of key in lang environment.
  // It's useful in the follows case:
  //   We have en and zh dictionaries, and the matched dictionary would be loaded instead of loading both dictionaries.
  fetchWord({ lang, key }) {
    // Returns false for skipping
    //  And will fallback to i18n(key)
    return false
  },
  // The fetch method should do something about updating raw word in matched dict file.
  // Be triggered when click `Save` button.
  fetchUpdate({ lang, key, value }) {
    return fetch('/i18n/update', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ lang, key, value })
    }).then(res => res.json())
  }
})

transaction
  .on('error', e => {
    console.error('error', e)
  })

@inject
class View extends React.Component {
  changeLanguage = lang => {
    // Injects context.i18n
    // And each function of context.i18n would forceUpdate children component
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
      </div>
    )
  }
}

ReactDOM.render(
  <Provider>
    <View/>
  </Provider>
)
```
