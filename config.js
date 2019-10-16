const path = require('path')

// context for webpack - root dir
const contextDir = '/memfs'

// dist for webpack
const distDir = path.join(contextDir, '/dist')

// dll output path and key
const DLL = {
  distDir: path.join(distDir, 'dll'),
  key: '__HUB_DEPENDENCIES__',
}

// dir where sources will be loaded
const sourceDir = path.join(contextDir, 'src')

module.exports = {
  paths: {
    contextDir,
    distDir,
    DLL,
    sourceDir,
  },
}
