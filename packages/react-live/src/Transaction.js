/**
 * @file: transaction
 * @author: Cuttle Cong
 * @date: 2017/12/20
 * @description:
 */

import EventEmitter from 'events'
import defaultTinyI18n from './defaultTinyI18n'

class Transaction extends EventEmitter {
  constructor(tinyI18n, config) {
    super()
    this.tinyI18n = tinyI18n || defaultTinyI18n
    this.setConfig(config)
  }
  context = { data: { reqs: [] } }
  config = {}

  /**
   *
   * @param config
   * @param config.fetchWord
   * @param config.fetchUpdate
   */
  setConfig(config = {}) {
    this.config = config || {}
  }

  register(lang) {
    if (this.context.lang !== lang) {
      this.context.lang = lang
      this.emit('update:lang', lang)
    }
  }

  async getLangInfo(extra) {
    if (this.config.fetchWord) {
      try {
        const req = { lang: this.context.lang, key: extra.id, ...extra }
        delete req.id
        const data = await this.config.fetchWord(req)
        if (data === false) {
          return this.tinyI18n.getWord(extra.id, this.context.lang)
        }
        this.emit('langInfo', data)
        return String(data)
      } catch (err) {
        err.id = 'langInfo'
        this.emit('error', err)
      }
      return this.tinyI18n.getWord(extra.id, this.context.lang)
    }
    return this.tinyI18n.getWord(extra.id, this.context.lang)
  }

  async update({ id, value, lang = this.context.lang }) {
    const req = { key: id, value, lang }
    this.emit('update', req)
    if (this.config.fetchUpdate) {
      try {
        const data = await this.config.fetchUpdate(req)
        if (data === false) {
          return data
        }
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
}

export default Transaction
