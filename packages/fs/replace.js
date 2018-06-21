/**
 * @file replace
 * @author Cuttle Cong
 * @date 2018/6/21
 * @description
 */
const fs = require('fs')
const babel = require('babel-core')
const t = require('babel-core').types

const { single, double } = require('./quote')

function overwrite(filename, id, value, map, options) {
  const fileContent = fs.readFileSync(filename, { encoding: 'utf8' })
  const newFileContent = checkHasKeyAndReplaceBabel(id, value, fileContent, map, options)
  if (newFileContent !== fileContent) {
    fs.writeFileSync(filename, newFileContent, { encoding: 'utf8' })
    return true
  }
  return false
}

function updateIdentifierStringLiteralName(path, updater) {
  let name
  if (t.isIdentifier(path)) {
    name = path.node.name
    updater(name, function(newValue) {
      path.node.name = newValue
    })
  }
  if (t.isStringLiteral(path)) {
    name = path.node.value
    updater(name, function(newValue) {
      path.node.value = newValue
    })
  }
}

function babelPlugin() {
  const obj = {
    ObjectProperty(path, data) {
      const replacer = data.opts.replacer || []
      const quote = data.opts.quote || 'single'
      const quoteWrap = quote === 'single' ? single : double

      const keyPath = path.get('key')
      const valuePath = path.get('value')
      updateIdentifierStringLiteralName(keyPath, function(preName, updater) {
        const obj = replacer.find(function(data) {
          return data.key === preName
        })
        if (obj && obj.hasOwnProperty('value')) {
          if (t.isStringLiteral(valuePath)) {
            obj.__replaced = true
            valuePath.node.value = obj.value
            valuePath.node.extra = {
              raw: quoteWrap(obj.value),
              rawValue: obj.value
            }
          }
        }
      })
    }
  }

  return {
    visitor: {
      ObjectExpression(path, data) {
        const force = data.opts.force || false
        const replacer = data.opts.replacer || []
        const quote = data.opts.quote || 'single'
        const quoteWrap = quote === 'single' ? single : double

        path.traverse(obj, data)
        if (force) {
          const notReplacedList = replacer.filter(function(node) {
            return !node.__replaced
          })

          notReplacedList.forEach(function(node) {
            path.node.properties.push({
              type: 'ObjectProperty',
              key: {
                type: 'StringLiteral',
                value: node.key,
                extra: {
                  raw: quoteWrap(node.key),
                  rawValue: node.key
                }
              },
              value: {
                type: 'StringLiteral',
                value: node.value,
                extra: {
                  raw: quoteWrap(node.value),
                  rawValue: node.value
                }
              }
            })
          })
        }
      }
    }
  }
}

function checkHasKeyAndReplaceBabel(key, value, content, map = {}, options) {
  const { force, quote } = {
    force: true,
    quote: 'single',
    ...options
  }

  if (key in map || force) {
    if (map[key] === value) {
      throw new Error('[tiny-i18n fs] The value of `' + key + '` equals `' + value + '`')
    }
    return babel.transform(content, {
      plugins: [[babelPlugin, { quote, force, replacer: [{ key: key, value: value }] }]],
      ast: false
    }).code
  }
  return content
}

module.exports = {
  checkHasKeyAndReplaceBabel,
  overwrite
}
