const webpack = require('webpack')
module.exports = {
  mode: 'development',
  entry: {
    keypad: './public/js/keypad.js',
    receiver: './public/js/receiver.js',
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
