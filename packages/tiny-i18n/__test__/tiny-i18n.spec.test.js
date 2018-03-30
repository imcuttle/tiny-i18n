/**
 * @file tiny-i18n.spec
 * @author Cuttle Cong
 * @date 2018/3/10
 * @description
 */

import {
  i18n,
  getDictionary,
  extendDictionary,
  getCurrentLanguage,
  setDictionary,
  setLanguage
} from '../index'


describe('tiny-i18n.spec', function () {
  beforeAll(function () {
    setDictionary('zh', {
      a: '啊',
      b: '吧',
      c: '你好${1}'
    })
    setDictionary('en', {
      a: 'a',
      b: 'b',
      c: 'c${1}'
    })
  })
  test('should getDictionary works', () => {
    expect(getDictionary('zh')).toEqual({
      a: '啊',
      b: '吧',
      c: '你好${1}'
    })
    expect(getDictionary('en')).toEqual({
      a: 'a',
      b: 'b',
      c: 'c${1}'
    })
  })
  test('should getCurrentLanguage works', () => {
    setLanguage('zh')
    expect(getCurrentLanguage()).toBe('zh')
  })

  test('should i18n works', () => {
    setLanguage('zh')
    expect(i18n('a')).toBe('啊')
    expect(i18n('c', '哈哈')).toBe('你好哈哈')

    setLanguage('en')
    expect(i18n('a')).toBe('a')
    expect(i18n('c', '哈哈')).toBe('c哈哈')
  })
})
