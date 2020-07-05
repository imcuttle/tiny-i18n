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
    return async function(req, res) {
      try {
        await fn.apply(this, arguments)
      } catch (e) {
        res.json(json(502, String(e)))
      }
    }
  }

  async function updateMiddleware(req, res) {
    const { key, lang, value } = req.body
    res.json(json(200, await fs.update(key, value, lang)))
  }

  r.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }))
    .post('/update', wrap(updateMiddleware))
    .get(
      '/word',
      wrap((req, res) => {
        const { key, lang } = req.query
        res.json(json(200, fs.getWordSync(key, lang)))
      })
    )
    .post(
      '/word',
      wrap((req, res) => {
        const { key, lang } = req.body
        res.json(json(200, fs.getWordSync(key, lang)))
      })
    )
    .get(
      '/languages',
      wrap((req, res) => {
        fs.getLanguages()
          .then(list => res.json(json(200, list)))
          .catch(err => res.json(json(500, err)))
      })
    )

  return r
}

module.exports = makeRouter
