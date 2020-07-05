/**
 * @file replace
 * @author Cuttle Cong
 * @date 2018/6/21
 * @description
 */
const { join } = require('path')
const I18nFs = require('../')

function makeFixture(name) {
  return join(__dirname, 'fixture', name)
}

describe('I18nFS', function() {

  const i18nFs = new I18nFs(makeFixture(''))
  it('should getLanguages', (done) => {
    i18nFs.getLanguages()
      .then(list => {
        expect(list).toEqual(['en-US', 'zh-CN'])
        done()
      })
  })

  it('should getWordSync', function () {
    expect(
      i18nFs.getWordSync('create', 'zh-CN')
    ).toBe('创建')
  })

  it('should i18nFs.update', async function () {
    let value = 'export_failvalue' + Date.now()
    expect(
      await i18nFs.update('export_fail', value, 'zh-CN')
    ).toBe(true)

    expect(
      await i18nFs.update('export_fail_xxx', value, 'zh-CN')
    ).toBe(true)
  })


  it('should i18nFs.update failed', async function () {
    expect(
      await new I18nFs(makeFixture(''), { force: false, quote: 'double' })
        .update('xxxxxyyyy', 'asdad', 'zh-CN')
    ).toBeFalsy()
  })

  it('should thrown error', async function () {
    try {
      const result = await i18nFs.update('export_fail', 'export_failvalue', 'zhxx-CN')
      expect(result).toMatchSnapshot()
    } catch (e) {
      expect(e)
        .toMatchSnapshot()
    }
  })

  it('should lang thrown error', async function () {
    try {
      const result = await i18nFs.update('export_fail_xxx', 'error', './../../zh-CN')
      expect(result).toMatchSnapshot()
    } catch (e) {
      expect(e)
        .toMatchSnapshot()
    }
  })
})
