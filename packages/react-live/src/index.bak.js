/**
 * Note: not support: _i('a') + _i('b')
 */

import React from 'react'
import qs from 'querystring'
import style from './Badge/style'
import { BadgeInner } from './Badge/index'
import { open } from './Modal/index'
import { NULL_CHAR, unHighlightActiveBadge, highlightActiveBadge, updateDOM } from './dom-utils'
import transaction from './transaction'
import ModalContent from './Modal/ModalContent'
import c from 'packages/react-live/src/classnames'

const core = require('tiny-i18n')
const { getOffset, proxy, styleUsable, createSingleElementView } = require('./utils')

transaction.setConfig({
    fetchAuth: null,
    fetchUpdate: null,
    fetchPush: null
})

function proxyReactCreateElement() {
    const ctx = {}
    proxy(React, 'createElement', function(createElement) {
        return function(name, props, ...children) {
            props = props || {}
            const getRaw = () => createElement.apply(null, arguments)

            const vendor = { id: [], raw: [], args: [], source: [] }
            let appended = false
            const append = (data = {}, source) => {
                if ('id' in data) {
                    if (!vendor.id.includes(data.id)) {
                        vendor.id.push(data.id)
                        if ('raw' in data) {
                            vendor.raw.push(data.raw)
                        }
                        if ('source' in data) {
                            vendor.source.push(data.source)
                        }
                        if ('args' in data) {
                            vendor.args.push(data.args)
                        }
                        appended = true
                    }
                }

                if (source) {
                    props['data-i18n-path'] = props['data-i18n-path'] || []
                    if (!props['data-i18n-path'].includes(source)) {
                        props['data-i18n-path'].push(source)
                    }
                }
            }

            function handleValue(json, source, withNull = true) {
                if (!Array.isArray(json)) {
                    json = [json]
                }
                json.forEach(data => append(data, source))
                const last = json[json.length - 1]
                return withNull ? `${NULL_CHAR}${last.raw}${NULL_CHAR}` : last.raw
            }

            if (typeof name === 'string' && props) {
                children = children.map((child, index, { length }) => {
                    if (typeof child === 'string') {
                        return spiderEntity(child, json =>
                            handleValue(json, 'children', !(length === 1 && child === child))
                        )
                    }
                    return child
                })
                // shallow walk
                let keyNames = Object.keys(props)
                keyNames.forEach(keyName => {
                    const value = props[keyName]
                    if (typeof value === 'string') {
                        props[keyName] = spiderEntity(value, json => handleValue(json, keyName, false))
                    }
                })

                if (appended) {
                    props.className = c(props.className, 'i18n-badge')
                    proxy(props, 'onMouseEnter', function(onMouseEnter) {
                        return function(evt) {
                            badgeInnerCenter.close()
                            const target = evt.target
                            const content = (
                                <ModalContent
                                    onClose={unHighlightActiveBadge}
                                    onActiveUpdate={(newId, oldId) => {
                                        unHighlightActiveBadge()
                                        highlightActiveBadge(newId)
                                    }}
                                    ref={ref => (ctx.content = ref)}
                                    {...vendor}
                                    value={vendor.raw.slice()}
                                    onSave={async data => {
                                        let passed = await transaction.update({
                                            id: data.data.id,
                                            value: data.value,
                                            source: data.data.src
                                        })
                                        if (passed) {
                                            const i = ctx.content.state.index
                                            if (ctx.content.lang === core.getLang().lang.replace(/_/g, '-')) {
                                                core.extendDictionary(core.getCurrentLanguage(), { [data.data.id]: data.value }, data.data.src)
                                                updateDOM(
                                                    target,
                                                    data.data.id,
                                                    vendor.raw[i],
                                                    _oldi(data.data.id, ...data.data.args)
                                                )
                                                vendor.raw[i] = data.value
                                                ctx.content.forceUpdate()
                                            }
                                        }
                                    }}
                                />
                            )
                            let dom = badgeInnerCenter.open({
                                onClick() {
                                    open({ children: content })
                                }
                            })
                            const { top, left } = getOffset(evt.target)
                            Object.assign(dom.style, {
                                position: 'absolute',
                                top: `${top}px`,
                                left: `${left}px`,
                                zIndex: 9999
                            })

                            if (onMouseEnter) {
                                return onMouseEnter.apply(this, arguments)
                            }
                        }
                    })

                    props['data-i18n-path'] = JSON.stringify(props['data-i18n-path'])
                    props['data-i18n-id'] = JSON.stringify(vendor.id)
                }
            }
            return appended ? createElement.call(null, name, props, ...children) : getRaw()
        }
    })
}

const badgeInnerCenter = createSingleElementView()
proxy(badgeInnerCenter, 'open', function(open) {
    return function(props, attributes, mountDom) {
        return open(<BadgeInner {...props} />, attributes, mountDom)
    }
})

const WRAP_CHAR = NULL_CHAR + NULL_CHAR
const regx = new RegExp(`(${WRAP_CHAR})(.+?)\\1`, 'g')

function spiderEntity(string = '', flow = json => json.raw) {
    return string.replace(regx, function(_, $1, $2) {
        const json = JSON.parse($2)
        return flow(json)
    })
}

const _oldi = global._i

// i18n edit-live Proxy
function _i(key, ...args) {
    let list = []
    args = args.map(
        arg =>
            arg.replace
                ? spiderEntity(arg, json => ((list = list.concat(json)), `${NULL_CHAR}${json.raw}${NULL_CHAR}`))
                : arg
    )

    let raw = _oldi.apply(null, [key].concat(args))
    if (list.length) {
        list.push({ args, id: key, raw, source: core.default.getI18nSource(key) })
    } else {
        list = { args, id: key, raw, source: core.default.getI18nSource(key) }
    }
    return `${WRAP_CHAR}${JSON.stringify(list)}${WRAP_CHAR}`
}

async function register() {
    if (global._i !== _i && typeof global._i === 'function') {
        transaction.register(core.default.getLang().lang.replace(/_/g, '-'))
        await transaction.authorization()
        if (!transaction.auth) {
            console.error(' i18n edit-live disabled, cause have no-auth')
            return
        }

        console.log(' 🙈 i18n edit-live works!')
        styleUsable(style).use()
        global._i = _i
        proxyReactCreateElement()
    }
}

if (!global.location) {
    module.exports = core
    console.warn("i18n edit-live is disabled, maybe the environment isn't browser.")
} else {
    module.exports = Object.assign(
        // extend 不可枚举的属性
        Object.create(core),
        {
            ...core,
            default: {
                ...core.default
            }
        }
    )

    const query = location.search && qs.parse(location.search.replace(/^\s*\?/, ''))
    if ((query && query.hasOwnProperty('i18n-edit-live')) || !!localStorage.getItem('i18n-edit-live')) {
        function wrapLoad(load) {
            return async function() {
                await register()
                return load.apply(this, arguments)
            }
        }

        const load = wrapLoad(core.load)
        module.exports.load = load
        module.exports.transaction = transaction

        if (module.exports.default) {
            module.exports.default.load = load
        }
    } else {
        console.warn(
            'i18n edit-live is disabled. Please' +
                '\nWay 1: append query string `?i18n-edit-live=true` in url.' +
                "\nWay 2: call `localStorage.setItem('i18n-edit-live', 'true')`, and then reload browser"
        )

        module.exports = core
    }
}

// }

// core.transaction =
// module.exports.transaction = transaction
// module.exports.switchLanguage = core.switchLanguage
// module.exports.tellBackendSwitch = core.tellBackendSwitch
// module.exports.load = core.load
