const path = require('path')
const mkdirp = require('mkdirp')
const realFs = require('fs')
const rimraf = require('rimraf')

const fsHelpers = require('./fs')
const dllCompiler = require('./compiler/dll')
const sourceCompiler = require('./compiler/source')
const config = require('../config')
const preloadPackages = require('./preloadPackages')

main()

async function main() {
  const vol = fsHelpers.init()
  const memfs = fsHelpers.fsInstance(vol)

  console.log('start')
  try {
    await preloadPackages({
      packages: [
        '@babel/core',
        '@babel/preset-env',
        '@babel/preset-react',
        'babel-loader',
        'css-loader',
        'style-loader',
        'vue-loader',

        'react',
        'react-dom',
      ],
      rootPath: config.paths.contextDir,
      fs: {
        input: realFs,
        output: memfs,
      },
    })
    console.log('Preload finished')

    await dllCompiler({
      fs: memfs,
      DLL_KEY: config.paths.DLL.key,
      DLL_PATH: config.paths.DLL.distDir,
      DLL_CONTEXT: config.paths.contextDir,
      packages: ['react', 'react-dom'],
    })
    console.log('DLL gen finished')

    const entryFilePath = path.join(config.paths.sourceDir, 'index.js')
    const stats = await sourceCompiler({
      fs: memfs,
      config,
      entryFilePath,
      sources: {
        [entryFilePath]: `
      import react from 'react'
      import { render } from 'react-dom'
      // import './styles.css'

      console.log(
        react,
        render
      )

      const App = () => {
        return <h1>Hello React!</h1>
      }

      render(<App />, document.getElementById('app'))
      `,
        [path.join(config.paths.sourceDir, 'styles.css')]: `
          body {
            background: red;
          }
        `,
      },
    })

    console.log('all done', stats.toJson('minimal'))
    // rimraf.sync('/node_modules/', memfs)
    // realFs.writeFileSync(path.join(__dirname, './out.json'), JSON.stringify(vol.toJSON()))
  } catch (e) {
    console.error(e)
  }
}
