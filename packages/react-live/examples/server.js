/**
 * @file server.js
 * @author Cuttle Cong
 * @date 2018/6/21
 * @description
 */

const express = require('express')
const live = require('@tiny-i18n/express-live')


const app = express()

app.use('/i18n/', live(__dirname + '/dict'))

app.listen(9999, () => {
  console.log('Server run on Port: 9999.')
})
