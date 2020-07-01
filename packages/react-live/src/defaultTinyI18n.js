let defaultTinyI18n = null
try {
  defaultTinyI18n = require('tiny-i18n')
  defaultTinyI18n = defaultTinyI18n ? defaultTinyI18n.default : defaultTinyI18n
} catch (e) {}

export default defaultTinyI18n
