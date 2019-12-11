const electron = require("electron");
const { Menu, MenuItem } = electron;
const app = electron.app;
const shell = electron.shell;
const { ipcMain } = require('electron')
const BrowserWindow = electron.BrowserWindow;
const { getTemplate } = require('./menu');

const https = require("https");
const path = require('path');
const fs = require("fs");
const isDev = require("electron-is-dev");

const express = require("express");
const mockExpressApp = express();
const bodyParser = require("body-parser");

let mockNodeServer=null;
let mockInfo = {};
let mainWindow;

const menuTemplate = getTemplate({
  onFireRequest: () => {
    mainWindow && mainWindow.webContents.send("fireRequest");
  }
});
const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

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
    mockExpressApp.use(bodyParser.urlencoded({ extended: false }));
    mockExpressApp.use(bodyParser.json());
    mockExpressApp.use(bodyParser.text({ type: "text/html" }));
    mockExpressApp.get("/*", handlePostback);
    mockExpressApp.post("/*", handlePostback);

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
    mockNodeServer = https.createServer({ key, cert }, mockExpressApp);
    mockNodeServer.listen(process.env.MOCK_CALLBACK_PORT || 8443, "0.0.0.0", () => {
      const mockerServerPort = mockNodeServer.address().port;
      console.log(`mock server listen on ${mockerServerPort}`);
      resolve({
        MOCK_CALLBACK_PORT: mockerServerPort,
        MOCK_CALLBACK_URL: `https://localhost:${mockerServerPort}/`
      });
    });
  });
}

async function start() {
  function createWindow() {
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 680,
      title: `Postmate ${app.getVersion()}`,
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
    
    ipcMain.on('openFile', (_, file)=>{
      shell.openItem(path.resolve(file));
    });
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

  ipcMain.on("startMockServer", async () => {
    console.info(`starting mock server ...`);
    mockInfo = await startMockServer();
    mainWindow.webContents.send("newVariables", mockInfo);
  });

  ipcMain.on("stopMockServer", async () => {
    console.info(`stopping mock server ...`);
    mockNodeServer.close(err => {
      if (err) console.error(err);
      else {
        console.info(`mock server stopped`);
        mockInfo = {
          MOCK_CALLBACK_PORT: "",
          MOCK_CALLBACK_URL: ""
        };
        mainWindow.webContents.send("newVariables", mockInfo);
      }
    });
  });
}

start();
