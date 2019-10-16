const webpack = require('webpack')
const realFs = require('fs')
const path = require('path')

const webpackRunner = require('./webpackRunner')
const memfshelpers = require('../fs')
const babelConfig = require('./.babelrc')

module.exports = function compiler({ config, entryFilePath, fs, sources }) {
  if (!sources[entryFilePath]) {
    throw new Error('Source should have an entry point: ' + entryFilePath)
  }

  loadSourcesInFs({ fs, sources })

  const compiler = webpack({
    mode: 'production',
    entry: entryFilePath,
    context: config.paths.contextDir,
    output: {
      filename: '[name].min.js',
      path: config.paths.distDir,
    },
    resolveLoader: {
      // ???
      // modules: ['/Users/Gio/develop/vue-research/dll-tests/node_modules/'],
      // mainFields: ['main', 'loader'],
    },
    module: {
      rules: [
        // {
        //   test: /\.css$/,
        //   use: ['style-loader', 'css-loader'],
        // },
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
      new webpack.DllReferencePlugin({
        context: config.paths.contextDir,
        manifest: path.join(config.paths.DLL.distDir, `${config.paths.DLL.key}.json`),
        name: config.paths.DLL.key,
      }),
    ],
  })

  compiler.inputFileSystem = fs
  compiler.outputFileSystem = fs

  return webpackRunner(compiler)
}

function loadSourcesInFs({ fs, sources }) {
  Object.entries(sources).forEach(([fileName, fileContent]) => {
    memfshelpers.set(fs, {
      fileName,
      fileContent,
    })
  })
}

function getLoaderPath(loaderName) {
  const loaderDirName = path.join(__dirname, '../../node_modules', loaderName)
  const packageJsonPath = path.join(loaderDirName, 'package.json')

  const { main } = JSON.parse(realFs.readFileSync(packageJsonPath))

  console.log(path.join(loaderDirName, main))
  return path.join(loaderDirName, main)
}

module.exports.loadSourcesInFs = loadSourcesInFs
