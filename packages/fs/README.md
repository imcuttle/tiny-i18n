# @tiny-i18n/fs

[![NPM version](https://img.shields.io/npm/v/@tiny-i18n/fs.svg?style=flat-square)](https://www.npmjs.com/package/@tiny-i18n/fs)
[![NPM Downloads](https://img.shields.io/npm/dm/@tiny-i18n/fs.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/@tiny-i18n/fs)

The utilities about some actions dealing with i18n files.

## API
### new Fs(i18nRoot, options)
- Example
```javascript
const Fs = require('@tiny-i18n/fs')
new Fs(/* ... */)
```
### Options

- `force` **boolean** (default: `true`)
  Whether should insert an new record when the `key` is not found in dictionary.
- `quote` **enum('single', 'double')** (default: `'single'`)
  The dictionary quote's rule.

### Fs#getLanguages(): Promise<string[]>
Returns languages asynchronously.

In actual fact, The returned languages is readdir from `i18nRoot`.

- Example
```javascript
fs.getLanguages().then(console.log)
```

### Fs::getWordSync(key: string, lang: string): any
Returns raw words in matched key and in exact environment.

### Fs::getDictSync(lang: string): any
Returns dictionary in matched language.

### Fs::update(key: string, value: string, lang: string, options: Options): boolean

Updates value of matched key.

## Related
- [@tiny-i18n/express-live](../express-live) - The express router about tiny-i18n's edit live
- [react-live](../react-live) - The magical effect making tiny-i18n could be used easily and edit live in react