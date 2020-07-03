# tiny-i18n

[![NPM version](https://img.shields.io/npm/v/tiny-i18n.svg?style=flat-square)](https://www.npmjs.com/package/tiny-i18n)
[![NPM Downloads](https://img.shields.io/npm/dm/tiny-i18n.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/tiny-i18n)

Tiny yet useful i18n library.

## API

### setDictionary

`(dict: object, lang: string = getCurrentLanguage()) => object`
Set dictionary of `lang`.

**NOTE: language field is non-case sensitivity.**

**'zh-CN' has same effect with 'zh-cn'**

```javascript
setDictionary(
  {
    cancel: 'Cancel',
    confirm: 'OK'
  },
  'zh-CN'
)
```

### extendDictionary

`(dict: object, lang: string = getCurrentLanguage()) => object`
Extend dictionary of `lang`.

```javascript
extendDictionary(
  {
    cancel: 'Cancel',
    confirm: 'OK'
  },
  'zh-CN'
)
```

### getWord(key: string, lang: string = getCurrentLanguage())

Get raw word (untranslated) of `key` in `lang` language environment.

```javascript
setDictionary(
  {
    cancel: 'Cancel',
    confirm: 'OK ${1}'
  },
  'zh-CN'
)

getWord('confirm', 'zh-CN') === 'OK ${1}'
```

### setLanguage(lang: string)

Set current language.

### getDictionary: (lang: string = getCurrentLanguage()) => object

```javascript
const dict = {
  cancel: 'Cancel',
  confirm: 'OK ${1}'
}
setDictionary(dict, 'zh-CN')

getDictionary('zh-CN') === dict
```

### getCurrentLanguage: () => string

**Note: tiny-i18n use [isomorphic-language](https://www.npmjs.com/package/isomorphic-language) to set current language at first time**

### i18n: (key: string ...args: string[]) => string

Get **translated words** in current language.

```javascript
setDictionary({
cancel: 'Cancel',
confirm: 'OK ${1}'
}, 'zh-CN')
setLanguage('zh-CN')
getCurrentLanguage() === 'zh-CN'

i18n('cancel') === 'Cancel'
i18n('confirm', ',Cuttle' /_ replaced by `${1}` _/) === 'OK ,Cuttle'

````
### createIsolateI18n()

NOTE: It's useful for create the internal independent i18n environment

```javascript
import tinyI18n from 'tiny-i18n'
const {createIsolateI18n, setDictionary, i18n} = tinyI18n
setDictionary({
  cancel: 'Cancel',
  confirm: 'OK ${1}'
}, 'zh-CN')
i18n('cancel') === 'Cancel' // true

const i = createIsolateI18n()
i.i18n('cancel') // throws error
// It should be call `i.setDictionary(...)` firstly.
````

## Examples

```javascript
const tinyI18n = require('tiny-i18n')
const { setDictionary, getDictionary, i18n, setLanguage } = tinyI18n

setDictionary(
  {
    a: '啊',
    b: '吧',
    c: '你好${1}'
  },
  'zh'
)
setDictionary(
  {
    a: 'a',
    b: 'b',
    c: 'c${1}'
  },
  'en'
)

expect(getDictionary('zh')).toEqual({
  a: '啊',
  b: '吧',
  c: '你好${1}'
})
expect(getDictionary('en')).toEqual({
  a: 'a',
  b: 'b',
  c: 'c${1}'
})

setLanguage('zh')
expect(i18n('a')).toBe('啊')
expect(i18n('c', '哈哈')).toBe('你好哈哈')

setLanguage('en')
expect(i18n('a')).toBe('a')
expect(i18n('c', '哈哈')).toBe('c哈哈')
```
