# @tiny-i18n/express-live

The express router about tiny-i18n's edit live.

## Usage

```bash
npm i @tiny-i18n/express-live
```

- server.js

```javascript
const express = require('express')
const live = require('@tiny-i18n/express-live')
const app = express()

app.use('/i18n/', live(__dirname + '/dict', /* options */))
app.listen(9999, () => {
  console.log('Server run on Port: 9999.')
})
```

- dict/common.js

```javascript
module.exports = {
  // ...
}
```

- dict/common.js

```javascript
module.exports = {
  // ...
}
```


- app.js (frontend)

```javascript
import '@tiny-i18n/react-live/register'
import { transaction, Provider, inject } from '@tiny-i18n/react-live'
import { setDictionary, getLanguages, getCurrentLanguage, i18n, getDictionary } from 'tiny-i18n'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import '@tiny-i18n/react-live/lib/style.css'

let zhDict = require('./dict/zh-CN')
let enDict = require('./dict/en-US')
setDictionary(zhDict, 'zh-CN')
setDictionary(enDict, 'en-US')

transaction.setConfig({
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

ReactDOM.render(
  // ...
)
```

## Options

Same as [@tiny-i18n/fs](../fs)

