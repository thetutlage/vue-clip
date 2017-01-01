'use strict'

const webpackConfig = require('./webpack.config.js')
delete webpackConfig.entry

const testType = process.argv.indexOf('--local') > -1 ? 'local' : 'remote'
const browsers = testType === 'local' ? ['Chrome'] : ['PhantomJS']

module.exports = function (config) {
  config.set({
    browsers: browsers,
    frameworks: ['mocha'],
    files: ['test/index.js'],
    preprocessors: {
      'test/index.js': ['webpack']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    singleRun: true
  })
}
