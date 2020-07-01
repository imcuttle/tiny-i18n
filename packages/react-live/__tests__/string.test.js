const {shrink, expand} = require('../src/string-utils')

describe('react-live string', function () {
  it('should expand&shrink', function () {
    const sec = 'hi world hi world hi xwdgh hi world'
    console.log('shrink()', shrink(sec), shrink(sec).length)
    console.log('expand()', expand(shrink(sec)), expand(shrink(sec)).length)
  });
});
