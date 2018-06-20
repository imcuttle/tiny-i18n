/**
 * @file: transaction
 * @author: Cuttle Cong
 * @date: 2017/12/20
 * @description:
 */

import EventEmitter from 'events'
import { getWord } from 'tiny-i18n'

class MyEventEmitter extends EventEmitter {
  context = { data: { reqs: [] } }
  config = {}
  auth = true

  setConfig(config = {}) {
    this.config = config
  }

  register(lang) {
    if (this.context.lang !== lang) {
      this.context.lang = lang
      this.emit('update:lang', lang)
    }
  }

  async getLangInfo(extra) {
    if (this.config.fetchLangInfo) {
      try {
        const req = { lang: this.context.lang, ...extra }
        const data = await this.config.fetchLangInfo(req)
        if (data === false) {
          return null
        }
        this.emit('langInfo', data)
        return data.toString()
      } catch (err) {
        err.id = 'langInfo'
        this.emit('error', err)
      }
      return null
    }
    return getWord(extra.id, this.context.lang)
  }

  async authorization() {
    if (this.config.fetchAuth) {
      try {
        const data = await this.config.fetchAuth(this.context.lang)
        this.emit('auth', data)
        this.auth = true
      } catch (err) {
        this.auth = false
        err.id = 'auth'
        this.emit('error', err)
      }
    } else {
      this.auth = true
    }
  }

  async update({ id, value, lang = this.context.lang, source }) {
    this.checkAuth()
    const req = { id, value, lang, source }
    if (this.config.fetchUpdate) {
      try {
        const data = await this.config.fetchUpdate(req)
        this.emit('update', data)
      } catch (err) {
        err.id = 'update'
        this.emit('error', err)
        return false
      }
    } else {
      this.context.data.reqs.push(req)
    }
    return true
  }

  async push() {
    this.checkAuth()
    if (this.config.fetchPush) {
      try {
        if (this.context.data.reqs.length) {
          const data = await this.config.fetchPush(this.context.data.reqs)
          this.emit('push', data)
          this.context.data.reqs = []
        }
      } catch (err) {
        err.id = 'push'
        this.emit('error', err)
      }
    }
  }

  checkAuth() {
    if (!this.auth) {
      const err = new Error('no auth')
      err.id = 'no-auth'
      this.emit('error', err)
      throw err
    }
  }
}

const main = new MyEventEmitter()
export default main
