# rename-overwrite

[![Greenkeeper badge](https://badges.greenkeeper.io/zkochan/rename-overwrite.svg)](https://greenkeeper.io/)

[![Status](https://travis-ci.org/zkochan/rename-overwrite.svg?branch=master)](https://travis-ci.org/zkochan/rename-overwrite "See test builds")

> Like `fs.rename` but overwrites existing file or directory

## Install

Install it via npm.

```
npm install rename-overwrite
```

## Usage

```js
const renameOverwrite = require('rename-overwrite')

renameOverwrite('old-dir-name', 'new-dir-name')
  .then(() => console.log('done'))
  .catch(err => console.log(err))
```

## API

### `renameOverwrite(oldPath, newPath) => Promise<void>`

Renames a file or directory asynchronously. Overwrites existing file or directory.

### `renameOverwrite.sync(oldPath, newPath)`

Renames a file or directory synchronously. Overwrites existing file or directory.

## License

[MIT](LICENSE)
