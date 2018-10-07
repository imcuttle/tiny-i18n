/**
 * @file: transaction
 * @author: Cuttle Cong
 * @date: 2017/12/20
 * @description:
 */

import EventEmitter from 'events'

export default function(tinyI18n) {
  const { getWord } = tinyI18n
  class MyEventEmitter extends EventEmitter {
    context = { data: { reqs: [] } }
    config = {}

    /**
     *
     * @param config
     * @param config.fetchWord
     * @param config.fetchUpdate
     */
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
      if (this.config.fetchWord) {
        try {
          const req = { lang: this.context.lang, key: extra.id, ...extra }
          delete req.id
          const data = await this.config.fetchWord(req)
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

    async update({ id, value, lang = this.context.lang }) {
      const req = { key: id, value, lang }
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

    // async push() {
    //   if (this.config.fetchPush) {
    //     try {
    //       if (this.context.data.reqs.length) {
    //         const data = await this.config.fetchPush(this.context.data.reqs)
    //         this.emit('push', data)
    //         this.context.data.reqs = []
    //       }
    //     } catch (err) {
    //       err.id = 'push'
    //       this.emit('error', err)
    //     }
    //   }
    // }
  }

  return new MyEventEmitter()
}
