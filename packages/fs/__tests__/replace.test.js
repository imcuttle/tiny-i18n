/**
 * @file replace
 * @author Cuttle Cong
 * @date 2018/6/21
 * @description
 */
const { join } = require('path')
const { readFileSync } = require('fs')
const { checkHasKeyAndReplaceBabel, overwrite } = require('../replace')

function makeFixture(name) {
  return join(__dirname, 'fixture', name)
}

describe('replace', function() {
  const enUSContent = readFileSync(makeFixture('en-US.js')).toString()

  it('should checkHasKeyAndReplaceBabel', () => {
    expect(
      checkHasKeyAndReplaceBabel('找不到我', '🎨', enUSContent, {}, { force: true, quote: 'double' })
    ).toMatchSnapshot()

    console.log(
      checkHasKeyAndReplaceBabel('all', '全部', enUSContent, { force: false })
    )
    // expect(() => ).toThrowErrorMatchingSnapshot()
  })
})
