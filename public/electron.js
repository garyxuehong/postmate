const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const https = require("https");
const fs = require("fs");
const path = require("path");
const isDev = require("electron-is-dev");

const express = require("express");
const mockPostbackServer = express();
const bodyParser = require("body-parser");

async function startMockServer() {
  const key = fs.readFileSync(path.join(__dirname, "../certs/key.pem"));
  const cert = fs.readFileSync(path.join(__dirname, "../certs/cert.pem"));
  return new Promise(resolve => {
    mockPostbackServer.use(bodyParser.urlencoded({ extended: false }));
    mockPostbackServer.use(bodyParser.json());
    mockPostbackServer.use(bodyParser.text({ type: "text/html" }));
    mockPostbackServer.get("/*", handlePostback);
    mockPostbackServer.post("/*", handlePostback);

    function handlePostback(req, res) {
      console.log(req.body);
      res.status(200);
      res.end();
    }

    console.info(`now starting mock server...`);
    const server = https.createServer({ key, cert }, mockPostbackServer);
    server.listen(process.env.MOCK_CALLBACK_PORT || 8443, "0.0.0.0", () => {
      const mockerServerPort = server.address().port;
      console.log(`mock server listen on ${mockerServerPort}`);
      resolve({
        MOCK_CALLBACK_PORT: mockerServerPort,
        MOCK_CALLBACK_URL: `https://localhost:${mockerServerPort}/`
      });
    });
  });
}

let mockInfo = {};
async function start() {
  let mainWindow;

  mockInfo = await startMockServer();

  function createWindow() {
    mainWindow = new BrowserWindow({
      width: 900,
      height: 680,
      webPreferences: {
        nodeIntegration: true
      }
    });
    mainWindow.loadURL(
      isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "../build/index.html")}`
    );
    if (isDev) {
      // Open the DevTools.
      //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
      mainWindow.webContents.openDevTools();
    }
    mainWindow.on("closed", () => (mainWindow = null));
    setTimeout(
      () => mainWindow.webContents.send("newVariables", mockInfo),
      3000
    );
  }

  app.on("ready", createWindow);

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (mainWindow === null) {
      createWindow();
    } else {
      setTimeout(
        () => mainWindow.webContents.send("newVariables", mockInfo),
        3000
      );
    }
  });
}

start();
