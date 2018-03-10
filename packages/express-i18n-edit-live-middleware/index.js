/**
 * @file: index
 * @author: Cuttle Cong
 * @date: 2017/12/20
 * @description:
 */

var express = require('express')
var u = require('path')
var i18nFS = require('./i18nFS')
var router = new express.Router()

function json(code, data) {
  return { code, data }
}

function authMiddleware(req, res) {
  res.json(json(200, 'ok'))
}

function updateMiddleware(req, res) {
  var id = req.ent.id
  var lang = req.ent.lang
  var value = req.ent.value
  var module = req.ent.module

  try {
    if (i18nFS.updateI18n(id, value, lang, module, true)) {
      res.json(json(200, 'ok'))
    } else {
      res.json(json(404, 'not found'))
    }
  } catch (ex) {
    res.json(json(502, ex.message))
  }
}

function indexMiddleware(req, res) {
  res.write('current: ' + u.join(req.baseUrl, req.url) + '\n')
  res.write('auth: ' + u.join(req.baseUrl, 'auth') + '\n')
  res.write('update: ' + u.join(req.baseUrl, 'update') + '\n')
  res.write('get: ' + u.join(req.baseUrl, 'get') + '\n')
  res.end()
}

function getMiddleware(req, res) {
  var id = req.ent.id
  var lang = req.ent.lang
  var module = req.ent.module

  var val = i18nFS.getI18n(id, lang, module)
  if (val) {
    res.json(json(200, val))
  } else {
    res.json(json(500, 'not found'))
  }
}

router
  .use(function (req, res, next) {
    if (req.method.toUpperCase() === 'POST') {
      req.ent = req.body
    } else {
      req.ent = req.query
    }
    next()
  })
  .get('/', indexMiddleware)
  .get('/auth', authMiddleware)
  .get('/update', updateMiddleware)
  .get('/get', getMiddleware)

module.exports = router
