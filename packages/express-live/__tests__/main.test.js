/**
 * @file main
 * @author Cuttle Cong
 * @date 2018/6/21
 * @description
 */
const request = require('supertest')
const express = require('express')
const { join } = require('path')

const live = require('../')

function makeFixture(name) {
  return join(__dirname, 'fixture', name)
}

describe('express-live', function() {

  describe('simple', function () {
    const app = express()
    app.use('/i18n/', live(makeFixture('simple')))

    it('should main languages', done => {
      request(app)
        .get('/i18n/languages')
        .end((err, res) => {
          expect(res.body).toEqual(
            expect.objectContaining({
              data: ['en-US', 'zh-CN']
            })
          )

          done()
        })
    })

    it('should main word', done => {
      request(app)
        .get('/i18n/word?key=create&lang=en-US')
        .end((err, res) => {
          expect(res.body).toEqual(
            expect.objectContaining({
              code: 200,
              data: '创建'
            })
          )

          done()
        })
    })

    it('should main update', done => {
      request(app)
        .post('/i18n/update')
        .send({ key: 'lalala', value: 'xixixi', lang: 'zh-CN' })
        .end((err, res) => {
          expect(res.body).toEqual(
            expect.objectContaining({ code: 502, data: 'Error: [tiny-i18n fs] The value of `lalala` equals `xixixi`' })
          )

          done()
        })
    })
  });

  describe('comple', function () {
    const app = express()
    app.use('/i18n/', live(makeFixture('complex')))

    it('should main languages', done => {
      request(app)
        .get('/i18n/languages')
        .end((err, res) => {
          expect(res.body).toEqual(
            expect.objectContaining({
              data: ['en-us', 'zh-cn']
            })
          )

          done()
        })
    })

    it('should main word', done => {
      request(app)
        .get('/i18n/word?key=create&lang=en-us/common')
        .end((err, res) => {
          expect(res.body).toEqual(
            expect.objectContaining({
              code: 200,
              data: '创建'
            })
          )

          done()
        })
    })

    it('should main update error', done => {
      request(app)
        .post('/i18n/update')
        .send({ key: 'same_value', value: 'xixixi', lang: 'zh-cn/main' })
        .end((err, res) => {
          expect(res.body).toEqual(
            expect.objectContaining({ code: 502, data: 'Error: [tiny-i18n fs] The value of `same_value` equals `xixixi`' })
          )

          done()
        })
    })

    it('should main update', done => {
      request(app)
        .post('/i18n/update')
        .send({ key: 'site_title', value: Date.now(), lang: 'zh-cn/main' })
        .end((err, res) => {
          expect(res.body).toMatchSnapshot()
          done()
        })
    })

    it('should main update error2', done => {
      request(app)
        .post('/i18n/update')
        .send({ key: 'site_title', value: Date.now(), lang: 'zh-cn/mainx' })
        .end((err, res) => {
          expect(res.body).toMatchSnapshot()
          done()
        })
    })
  });

})
