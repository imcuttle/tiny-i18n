# tiny-i18n

Tiny yet useful i18n helper.

## API

### setDictionary 
`(lang: string, dict: object) => object`   

### extendDictionary 
`(lang: string, dict: object) => object`  

### setLanguage(lang: string)

### getDictionary: (lang: string) => object
### getCurrentLanguage: () => string
**Note: tiny-i18n use [isomorphic-language](https://www.npmjs.com/package/isomorphic-language) to set current language at first time**

### i18n: (key: string ...args: string[]) => string

## Examples

```javascript
const {
  setDictionary,
  getDictionary,
  i18n,
  setLanguage
} = require('tiny-i18n')

setDictionary('zh', {
  a: '啊',
  b: '吧',
  c: '你好${1}'
})
setDictionary('en', {
  a: 'a',
  b: 'b',
  c: 'c${1}'
})

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
