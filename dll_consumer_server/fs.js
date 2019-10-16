const path = require('path')
const joinPath = require('memory-fs/lib/join')

const { Volume, fs: memfs, createFsFromVolume } = require('memfs')

module.exports = {
  init() {
    return new Volume()
  },
  set(vol, { fileName, fileContent }) {
    const dirName = path.dirname(fileName)
    if (!fileExists(vol, dirName)) {
      vol.mkdirSync(dirName, { recursive: true })
    }
    vol.writeFileSync(fileName, fileContent)
  },
  get(vol, filePath) {
    return vol.readFileSync(filePath).toString()
  },
  fsInstance(vol) {
    return ensureWebpackMemoryFs(createFsFromVolume(vol))
  },
  toJSON(vol) {
    return vol.toJSON()
  },
}

function fileExists(vol, filePath) {
  try {
    vol.accessSync(filePath, memfs.constants.F_OK)
    return true
  } catch (e) {
    return false
  }
}

function ensureWebpackMemoryFs(fs) {
  // Return it back, when it has Webpack 'join' method
  if (fs.join) {
    return fs
  }

  // Create FS proxy, adding `join` method to memfs, but not modifying original object
  const nextFs = Object.create(fs)
  nextFs.join = joinPath

  return nextFs
}
