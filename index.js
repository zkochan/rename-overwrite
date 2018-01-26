'use strict'
const fs = require('graceful-fs')
const promisify = require('util.promisify')
const rimraf = promisify(require('rimraf'))
const rimrafSync = require('rimraf').sync
const timeout = require('timeout-then')

const rename = promisify(fs.rename)

module.exports = function renameOverwrite (oldPath, newPath) {
  return rename(oldPath, newPath)
    .catch(err => {
      switch (err.code) {
        case 'ENOTEMPTY':
        case 'EEXIST':
          return rimraf(newPath)
            .then(() => rename(oldPath, newPath))
        // weird Windows shit
        case 'EPERM':
          return timeout(200)
            .then(() => rimraf(newPath))
            .then(() => rename(oldPath, newPath))
        default:
          throw err
      }
    })
}

module.exports.sync = function renameOverwriteSync (oldPath, newPath) {
  try {
    fs.renameSync(oldPath, newPath)
  } catch (err) {
    switch (err.code) {
      case 'ENOTEMPTY':
      case 'EEXIST':
      case 'EPERM': // weird Windows shit
        rimrafSync(newPath)
        fs.renameSync(oldPath, newPath)
        return
      default:
        throw err
    }
  }
}
