'use strict'

const webpackConfig = require('./webpack.config.js')
delete webpackConfig.entry

module.exports = function (config) {
  config.set({
    browsers: ['Chrome'],
    frameworks: ['mocha'],
    files: ['test/index.js'],
    preprocessors: {
      'test/index.js': ['webpack']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    singleRun: false
  })
}
