'use strict';

exports.__esModule = true;
exports.getDOMListFromID = getDOMListFromID;
exports.highlightActiveBadge = highlightActiveBadge;
exports.unHighlightActiveBadge = unHighlightActiveBadge;
exports.updateDOM = updateDOM;

var _utils = require('./utils');

/**
 * @file: dom-utils
 * @author: Cuttle Cong
 * @date: 2017/12/20
 * @description:
 */
var debug = require('debug')('@tiny-i18n/react-live');
function getDOMListFromID(id) {
  return [].slice.call(document.querySelectorAll('*[data-i18n-keylist*=' + JSON.stringify(JSON.stringify(id)) + ']'));
}

function highlightActiveBadge(id) {
  var list = getDOMListFromID(id);
  list.forEach(function (ele) {
    ele.classList.add('i18n-active');
  });
}

function unHighlightActiveBadge() {
  var list = [].slice.call(document.querySelectorAll('*[data-i18n-keylist].i18n-active'));
  list.forEach(function (ele) {
    ele.classList.remove('i18n-active');
  });
}

function updateDOM(el, id, oldRaw, newRaw) {
  var list = getDOMListFromID(id);
  debug('updateDOM list: %o', list);

  function replace(content, maxLev) {
    if (maxLev < 1) {
      return content;
    }

    var striped = (0, _utils.strip)(content, function (str, level, _) {
      // console.log(str, maxLev)
      debug('strip str chunk', str);
      // level = level || 1
      if (str === oldRaw) {
        return (0, _utils.toWrappedString)(newRaw, void 0, maxLev);
      }

      if (maxLev > 1) {
        return (0, _utils.toWrappedString)(replace(str, maxLev - 1), void 0, maxLev);
      }

      return _;
    }, maxLev);

    // i18n('a') + i18n('tpl', i18n('a'))
    return replace(striped, maxLev - 1);
  }

  list.forEach(function (ele) {
    var pathmap = ele.getAttribute('data-i18n-pathmap') || '{}';
    try {
      pathmap = JSON.parse(pathmap);
    } catch (e) {
      pathmap = {};
    }

    var paths = pathmap[id];
    if (paths) {
      paths.forEach(function (_ref) {
        var p = _ref[0],
            maxLev = _ref[1];

        if (/^children\[(\d+)]$/.test(p)) {
          var index = parseInt(RegExp.$1);
          var node = ele.childNodes[index];

          node.textContent = replace(node.textContent, maxLev);
        } else {
          ele.setAttribute(p, replace(ele.getAttribute(p), maxLev));
        }
      });
    }
  });
}