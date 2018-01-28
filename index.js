'use strict'
const fs = require('graceful-fs')
const promisify = require('util.promisify')
const rimraf = promisify(require('rimraf'))
const rimrafSync = require('rimraf').sync
const delay = require('delay')

const rename = promisify(fs.rename)

module.exports = function renameOverwrite (oldPath, newPath) {
  return _renameOverwrite(oldPath, newPath, 0, 200)
}

const MAX_RETRY = 8

function _renameOverwrite (oldPath, newPath, tries, delayOnEperm) {
  return rename(oldPath, newPath)
    .catch(err => {
      switch (err.code) {
        case 'ENOTEMPTY':
        case 'EEXIST':
          return rimraf(newPath)
            .then(() => rename(oldPath, newPath))
        // weird Windows stuff
        case 'EPERM':
          return delay(200)
            .then(() => rimraf(newPath))
            .then(() => rename(oldPath, newPath))
        default:
          throw err
      }
    })
    .catch(err => {
      // Windows Defender holds locks on newly created files
      // so EPERM errors are retried a lot
      // see related issue: https://github.com/pnpm/pnpm/issues/1015
      if (err.code !== 'EPERM' || tries >= MAX_RETRY) {
        throw err
      }
      return delay(delayOnEperm)
        .then(() => _renameOverwrite(oldPath, newPath, tries + 1, delayOnEperm + 200))
    })
}

module.exports.sync = function renameOverwriteSync (oldPath, newPath) {
  try {
    fs.renameSync(oldPath, newPath)
  } catch (err) {
    switch (err.code) {
      case 'ENOTEMPTY':
      case 'EEXIST':
      case 'EPERM': // weird Windows stuff
        rimrafSync(newPath)
        fs.renameSync(oldPath, newPath)
        return
      default:
        throw err
    }
  }
}
