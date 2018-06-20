/**
 * @file utils
 * @author Cuttle Cong
 * @date 2018/6/19
 * @description
 */
const utils = require('../utils')

describe('utils', function () {
  it('should utils.stripAndParse', () => {
    console.log(utils.stripAndParse(utils.toWrappedString([1, 2, 3])))

  })
})
