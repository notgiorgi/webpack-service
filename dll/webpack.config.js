// library.webpack.config.js
const path = require('path')
const webpack = require('webpack')

const config = require('../config')

const distPath = path.resolve(__dirname, './dist')

module.exports = {
  mode: 'production',

  entry: {
    [config.DLL_KEY]: ['query-string', 'vue'],
  },
  output: {
    filename: '[name].dll.js',
    path: distPath,
    library: '[name]',
  },
  plugins: [
    new webpack.DllPlugin({
      context: path.resolve(__dirname),
      name: '[name]',
      path: path.join(distPath, '[name].json'),
    }),
  ],
}
