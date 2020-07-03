/**
 * @file: transaction
 * @author: Cuttle Cong
 * @date: 2017/12/20
 * @description:
 */

import { EventEmitter } from 'events'
import { TinyI18n } from 'tiny-i18n'

type TransactionConfig = {
  fetchUpdate?: (data: TransactionData) => boolean | Promise<boolean>
  fetchWord?: (data: TransactionData) => string | false | Promise<string | false>
}
type TransactionInputData = {
  id?: string
  lang?: string
  value?: string
}

type TransactionData = {
  key?: string
  lang?: string
  value?: string
} & any

export default class Transaction extends EventEmitter {
  public tinyI18n: TinyI18n
  constructor(tinyI18n?: TinyI18n, config?: TransactionConfig)
  config: TransactionConfig

  setConfig(config?: TransactionConfig): void

  register(lang: string): void

  getLangInfo(extra: any & TransactionInputData): Promise<string>

  update(data: TransactionInputData): Promise<boolean>
}
