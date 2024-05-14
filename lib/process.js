const fs = require("fs");
const path = require("path");
const logFilePath = path.join(__dirname, "app.log");

const processData = (data) => {
  let message = JSON.stringify(data);
  const timestamp = new Date().toISOString();
  const size = fs.statSync(logFilePath)
  if(size.size >= 10828) {
    fs.truncateSync(logFilePath)
  }

  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFilePath, logMessage); // Log to file
};

module.exports = { processData };
