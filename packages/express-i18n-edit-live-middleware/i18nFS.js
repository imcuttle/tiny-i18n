/**
 * @file: updateI18n
 * @author: Cuttle Cong
 * @date: 2017/12/20
 * @description:
 */
var config = require('common/config')
var nps = require('path')
var fs = require('fs')

var babel = require('babel-core')
// var generate = require('babel-generator').default
var t = babel.types

function updateI18n(id, value, lang, module, force) {
  lang = lang.replace(/_/g, '-')
  var commonFile = nps.join(config.path.extraFrontendAsset, 'i18n', lang, 'common.js')
  var moduleFile = nps.join(config.path.extraFrontendAsset, 'i18n', lang, module + '.js')

  var commonValue = getValue(commonFile, id)
  return overwrite(moduleFile, id, value, force && !commonValue)
         || overwrite(commonFile, id, value, force)
}

function getI18n(id, lang, module) {
  lang = lang.replace(/_/g, '-')
  var commonFile = nps.join(config.path.extraFrontendAsset, 'i18n', lang, 'common.js')
  var moduleFile = nps.join(config.path.extraFrontendAsset, 'i18n', lang, module + '.js')

  return getValue(moduleFile, id) || getValue(commonFile, id)
}

exports.updateI18n = updateI18n
exports.getI18n = getI18n

function getValue(filename, id) {
  var fileContent = fs.readFileSync(filename, { encoding: 'utf8' })
  var dict = eval(fileContent)
  console.log(dict)
  return dict[id]
}

function overwrite(filename, id, value, force) {
  var fileContent = fs.readFileSync(filename, { encoding: 'utf8' })
  var newFileContent = checkHasKeyAndReplaceBabel(id, value, fileContent, force)
  if (newFileContent !== fileContent) {
    fs.writeFileSync(filename, newFileContent, { encoding: 'utf8' })
    return true
  }
}

function updateIdentifierStringLiteralName(path, updater) {
  var name
  if (t.isIdentifier(path)) {
    name = path.node.name
    updater(name, function (newValue) {
      path.node.name = newValue
    })
  }
  if (t.isStringLiteral(path)) {
    name = path.node.value
    updater(name, function (newValue) {
      path.node.value = newValue
    })
  }
}

function babelPlugin() {
  var obj = {
    ObjectProperty(path, data) {
      var replacer = data.opts.replacer || []

      var keyPath = path.get('key')
      var valuePath = path.get('value')
      updateIdentifierStringLiteralName(
        keyPath,
        function (preName, updater) {
          var obj = replacer.find(function (data) {
            return data.key === preName
          })
          if (obj && obj.hasOwnProperty('value')) {
            if (t.isStringLiteral(valuePath)) {
              obj.__replaced = true
              valuePath.node.value = obj.value
              valuePath.node.extra = {
                raw: JSON.stringify(obj.value),
                rawValue: obj.value
              }
            }
          }
        }
      )
    }
  }


  return {
    visitor: {
      ObjectExpression(path, data) {
        var force = data.opts.force || false
        var replacer = data.opts.replacer || []

        path.traverse(obj, data)
        if (force) {
          var notReplacedList = replacer.filter(function (node) {
            return !node.__replaced
          })

          notReplacedList.forEach(function (node) {
            path.node.properties.push(
              {
                type: 'ObjectProperty',
                key: {
                  type: 'StringLiteral',
                  value: node.key,
                  extra: {
                    raw: JSON.stringify(node.key),
                    rawValue: node.key
                  }
                },
                value: {
                  type: 'StringLiteral',
                  value: node.value,
                  extra: {
                    raw: JSON.stringify(node.value),
                    rawValue: node.value
                  }
                }
              }
            )
          })
        }
      }

    }
  }
}

function checkHasKeyAndReplaceBabel(key, value, content, force) {
  var map = eval(content)
  if (key in map || force) {
    if (map[key] === value) {
      throw new Error('the value of `' + key + '` equals `' + value + '`')
    }
    return babel.transform(content, {
      plugins: [
        [babelPlugin, { force: force, replacer: [{ key: key, value: value }] }]
      ],
      ast: false
    }).code
    // return generate(ast, {jsonCompatibleStrings: false}).code
  }
  return content
}

function checkHasKeyAndReplace(key, value, content, filename) {
  var map = eval(content)
  if (key in map) {
    if (map[key] === value) {
      throw new Error('the value of `' + key + '` equals `' + value + '`')
    }
    var rgxKey = new RegExp('([\'"])' + key + '\\1(\\s*:\\s*)([\'"])(.*?)\\3', 'g')
    var newContent = content.replace(rgxKey, function (_, $1, $2, $3, $4) {
      console.log('i18n: found the key -> ' + key, 'in', filename)
      console.log('  ' + JSON.stringify(_))
      console.log(' -> ', JSON.stringify(key) + $2 + JSON.stringify(value))
      return JSON.stringify(key) + $2 + JSON.stringify(value)
    })
    return newContent
  }
  return content
}
