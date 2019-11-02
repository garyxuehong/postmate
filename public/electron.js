const electron = require("electron");
const log = require("electron-log");

const https = require("https");
const fs = require("fs");
const path = require("path");
const isDev = require("electron-is-dev");

const express = require("express");
const bodyParser = require("body-parser");

const { autoUpdater } = require("electron-updater");
log.transports.file.level = "debug";
autoUpdater.logger = log;

async function checkUpdate() {
  const result = await autoUpdater.checkForUpdatesAndNotify();
}

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const mockPostbackServer = express();

let mockInfo = {};
let mainWindow;

async function startMockServer() {
  const key = fs.readFileSync(
    path.join(__dirname, isDev ? "../certs/key.pem" : "../build/certs/key.pem")
  );
  const cert = fs.readFileSync(
    path.join(
      __dirname,
      isDev ? "../certs/cert.pem" : "../build/certs/cert.pem"
    )
  );
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
      let variables = {};
      if (typeof req.body === "string") {
        try {
          variables = { ...JSON.parse(req.body) };
        } catch (e) {
          console.warn(e);
        }
      } else {
        variables = req.body;
      }
      setTimeout(() => {
        mainWindow.send("newVariables", variables);
      });
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

async function start() {
  mockInfo = await startMockServer();

  function createWindow() {
    mainWindow = new BrowserWindow({
      width: 1200,
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

  app.on(
    "certificate-error",
    (event, webContents, url, error, certificate, callback) => {
      if (url.startsWith("https://localhost")) {
        event.preventDefault();
        callback(true);
      } else {
        callback(false);
      }
    }
  );
}

start();
