module.exports = function(compiler) {
  return new Promise((resolve, reject) => {
    compiler.run(function webpackCompilerRunCallback(err, stats) {
      if (err) {
        return reject(err)
      }
      if (stats.hasErrors()) {
        reject(stats.toJson().errors)
      }
      if (stats.hasWarnings()) {
        console.warn(stats.toJson().warnings)
      }
      resolve(stats)
    })
  })
}
