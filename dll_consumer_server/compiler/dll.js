const webpack = require('webpack')
const path = require('path')

const webpackRunner = require('./webpackRunner')

module.exports = function compileDLL({ fs, DLL_KEY, DLL_PATH, DLL_CONTEXT, packages }) {
  const compiler = webpack({
    mode: 'production',
    context: DLL_CONTEXT,

    entry: {
      // DEPS
      [DLL_KEY]: packages,
    },
    output: {
      filename: '[name].dll.js',
      path: DLL_PATH,
      library: '[name]',
    },
    plugins: [
      new webpack.DllPlugin({
        context: DLL_CONTEXT,
        name: '[name]',
        path: path.join(DLL_PATH, '[name].json'),
      }),
    ],
  })

  compiler.inputFileSystem = fs
  compiler.outputFileSystem = fs

  return webpackRunner(compiler)
}
