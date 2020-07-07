/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/6/18
 * @description
 */

import * as React from 'react'
import Transaction from './Transaction'

import { TinyI18n } from 'tiny-i18n'

export type SettingType = {
  enabled?: boolean
}

export type ReactI18nLiveType = {
  tinyI18n?: TinyI18n
  transaction?: Transaction
  createElement?: Extract<React, 'createElement'>
}

export type ReactI18nLive = {
  transaction: Transaction
  configure: (setting: SettingType) => void
  getSetting(): SettingType
  originTinyI18n: TinyI18n
  tinyI18n: TinyI18n
  createElement: Extract<React, 'createElement'>
}

export default function createReactI18nLive(opts?: ReactI18nLiveType): ReactI18nLive

export function createWrappedI18n(i18n: TinyI18n['i18n'], opts?: { setting?: SettingType }): TinyI18n['i18n']

export function createWrappedSetLanguage(
  setLanguage: TinyI18n['setLanguage'],
  opts?: { setting?: SettingType; transaction?: Transaction }
): TinyI18n['setLanguage']
