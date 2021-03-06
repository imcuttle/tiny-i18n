module.exports = {
  presets: [
    [
      'env',
      {
        targets: {
          node: '6',
          browsers: ['ie>=9']
        },
        modules: false,
        loose: true,
        useBuiltIns: true
      }
    ],
    'react'
  ],
  "plugins": [
//    "transform-decorators-legacy",
//    "external-helpers",
    "transform-class-properties",
    "transform-object-rest-spread",
    [
      "transform-runtime",
      {
        "helpers": false,
        "polyfill": false,
        "regenerator": true
      }
    ]
  ],
}
