const fs = require('fs');
const { processData } = require("./lib/process");
const filename = "../logtify.txt";

const logReadFile = (req, res, next) => {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading file:', err);
          next(err); // Pass error to the error handling middleware
        } else {
          req.fileData = data; // Attach file data to the request object
          console.log(data, 'data1')
        }
      });
      
    next()
};

module.exports = logReadFile


const NodeLogtify = function (request, response, next) {
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

      // console.log({
      //   query,
      //   params,
      //   nameController: route ? route.stack[0].name : null,
      //   device: request.headers["user-agent"],
      //   ip: request.headers["x-forwarded-for"] || request.socket.remoteAddress,
      //   remoteFamily,
      //   processingTime: Date.now() - requestStart,
      //   body: payloadBody
      //     ? payloadBody
      //     : body.toString()
      //     ? JSON.parse(body.toString())
      //     : null,
      //   errorMessage,
      //   method,
      //   url,
      //   baseUrl,
      //   originalUrl,
      //   response: {
      //     statusCode,
      //     statusMessage,
      //     headers,
      //   },
      // });
    });

    next();
  } catch (e) {
    console.log(e, "ERROR");
    next(e);
  }
};

module.exports = { NodeLogtify, logReadFile };
