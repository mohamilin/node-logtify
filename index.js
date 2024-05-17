const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "./lib/app.log");
const { processData } = require("./lib/process");

const readLog = () => {
  const data = fs.readFileSync(logFilePath, "utf8");
  const lines = data.split("\n").filter((line) => line.trim() !== "");

  const lastLine = lines[lines.length - 1];

  // Extract the JSON part of the last line
  if (lines.length > 0) {
    const jsonData = lastLine.match(/\{.*\}/);
    try {
      // Parse the JSON data
      const parsedData = JSON.parse(jsonData[0]);
      return parsedData;
    } catch (e) {
      console.error("Error parsing JSON:", e);
    }
  } else {
    return null
  }
};

const nodeLogtify = function (request, response, next) {
  try {
    const requestStart = Date.now();

    let errorMessage = null;
    let body = [];
    let payloadBody = request.body;
    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      body = Buffer.concat(body).toString();
    });

    request.on("error", (error) => {
      console.log(error, "FAILED");
      errorMessage = error.message;
    });

    const originalJson = response.json;
    response.json = function (results) {
      const ModifybodyJson = { ...results };
      errorMessage = results;
      originalJson.call(this, ModifybodyJson);
    };

    response.on("finish", () => {
      const { method, socket, url } = request;
      const { remoteFamily } = socket;

      const {
        statusCode,
        statusMessage,
        req: { route, baseUrl, originalUrl, query, params },
      } = response;
      const headers = response.getHeaders();

      processData({
        query,
        params,
        nameController: route ? route.stack[0].name : null,
        device: request.headers["user-agent"],
        ip: request.headers["x-forwarded-for"] || request.socket.remoteAddress,
        remoteFamily,
        processingTime: Date.now() - requestStart,
        body: payloadBody
          ? payloadBody
          : body.toString()
          ? JSON.parse(body.toString())
          : null,
        errorMessage,
        method,
        url,
        baseUrl,
        originalUrl,
        response: {
          statusCode,
          statusMessage,
          headers,
        },
      });
    });

    next();
  } catch (e) {
    console.log(e, "ERROR");
    next(e);
  }
};

const nodeCronLogtify = (filePath, content = '') => {
  try {
    const timestamp = new Date().toISOString();
    const message = `${timestamp} - ${content}\n`;

    const projectRoot = process.cwd();
    const projectPath = path.join(projectRoot, filePath);
    if(!fs.existsSync(projectPath)) {
    
      fs.writeFileSync(projectPath, message);
      console.log({
        label: 'SUCCESS NODE-LOGTIFY',
        message: 'Log file created' + projectPath,
        detail: null,
      })
    } else {
      fs.appendFileSync(projectPath, message, 'utf8');
      console.log({
        label: 'SUCCESS NODE-LOGTIFY',
        message: 'Log file writed' + projectPath,
        detail: null,
      })
    }
  } catch (error) {
    console.log({
      label: 'ERROR NODE-LOGTIFY',
      message : 'Error creating log cron file',
      detail: error,
    })
  }
}

module.exports = { nodeLogtify, readLog, nodeCronLogtify };
