const express = require("express");

const app = express();
const PORT = 3000;
const { NodeLogtify } = require("../index");

const routes = require("./routers");

app.use(NodeLogtify);

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
