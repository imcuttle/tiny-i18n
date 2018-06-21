/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/6/21
 * @description
 */

const Fs = require('@tiny-i18n/fs')
const { Router } = require('express')
const bodyParser = require('body-parser')

function makeRouter(i18nRoot, options) {
  const fs = new Fs(i18nRoot, options)

  const r = new Router()
  function json(code, data) {
    return { code, data }
  }

  function wrap(fn) {
    return function(req, res) {
      try {
        fn.apply(this, arguments)
      } catch (e) {
        res.json(json(502, String(e)))
      }
    }
  }

  function updateMiddleware(req, res) {
    const { key, lang, value } = req.body
    res.json(json(200, fs.update(key, value, lang)))
  }

  r.post('/update', bodyParser.json(), bodyParser.urlencoded({ extended: true }), wrap(updateMiddleware))
    .get(
      '/languages',
      wrap((req, res) => {
        fs.getLanguages()
          .then(list => res.json(json(200, list)))
          .catch(err => res.json(json(500, err)))
      })
    )
    .get(
      '/word',
      wrap((req, res) => {
        const { key, lang } = req.query
        res.json(json(200, fs.getWordSync(key, lang)))
      })
    )

  return r
}

module.exports = makeRouter
