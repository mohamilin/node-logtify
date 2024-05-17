# Node Logtify

## disclaimer
This project is under active `Development` and may be unstable or contain bugs. We do not recommend using it in a production environment. 

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
const { nodeLogtify, readLog } = require('node-logtify');

const PORT = 3000;

app.use(nodeLogtify);

app.use((req, res, next) => {
  setTimeout(() => {
    const dataLog = readLog()
    // Save the log to Database
    console.log('dataLog:', readLog)
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

## Example Log Cron

```js
const express = require("express");
const app = express();
const cron = require('node-cron');
const { nodeCronLogtify } = require('node-logtify');

const PORT = 3000;


cron.schedule('* * * * *', () => {
    /**
     * required :
     *   1. a file for store logs, example: cron.log
     *   2. State for log, example :  Cron Running
     * 
     * if a state is object : you must convert in JSON Stringify
     * 
    **/
    nodeCronLogtify('cron.log', 'Cron Running')
    nodeCronLogtify('cron.log', JSON.stringify({message: 'Cron Running'}))

});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

