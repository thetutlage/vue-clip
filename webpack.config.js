'use strict'

const UnminifiedWebpackPlugin = require('unminified-webpack-plugin')

module.exports = {
  entry: './index.js',
  output: {
    path: './dist',
    filename: 'vue-clip.min.js',
    libraryTarget: 'umd'
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },
  plugins: [
    new UnminifiedWebpackPlugin()
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  }
}
