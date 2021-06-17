const webpack = require('webpack')

// const ESLintPlugin = require('eslint-webpack-plugin')
// const WebpackModules = require('webpack-modules')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const TerserPlugin = require('terser-webpack-plugin')
// const packageJSON = require('./package.json')

module.exports = {
  entry: {
    keypad: './js/keypad.js',
    receiver: './js/receiver.js',
  },
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].js',
    library: 'keypad',
    // libraryTarget: 'window',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      { test: /\.css$/, 
        use: [ 'style-loader', 'css-loader', ],
      },
    ],
  },
};
