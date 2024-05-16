# Node Logtify



## Installation 
This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
$ npm install node-logtify
```
## API

<!-- eslint-disable no-unused-vars -->

```js
const { nodeLogtify } = require('node-logtify')
```
## Example

```js
const express = require("express");
const app = express();
const PORT = 3000;
const { nodeLogtify, logReadFile } = require('node-logtify');

app.use(nodeLogtify);

app.use((req, res, next) => {
  setTimeout(() => {
    const dataLog = logReadFile()
    // Save the log to Database
    console.log('dataLog:', dataLog)
  }, 500);
  next()
})

app.get('/', (req, res) => {
  return res.status(200).json('Hello World !);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});


```