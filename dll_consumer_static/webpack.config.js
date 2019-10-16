const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const config = require('../config')
const babelConfig = require('./.babelrc.js')

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, './src/index.js'),
  context: __dirname,
  output: {
    filename: '[name].min.js',
    path: path.join(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelConfig,
        },
      },
    ],
  },

  plugins: [
    new VueLoaderPlugin(),
    new webpack.DllReferencePlugin({
      context: path.resolve(__dirname, '../dll'),
      manifest: require(`../dll/dist/${config.DLL_KEY}.json`),
      name: config.DLL_KEY,
    }),
  ],
}
