const { app, BrowserWindow, dialog, shell } = require("electron");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const HOST = "127.0.0.1";
const PORT = 41783;
const APP_URL = `http://${HOST}:${PORT}/playlist.html`;
const PLAYLIST_FILE = path.join(__dirname, "..", "playlist.html");

let mainWindow;
let server;

app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });

  app.whenReady().then(async () => {
    try {
      await startLocalServer();
      await createWindow();
    } catch (error) {
      dialog.showErrorBox(
        "Jukebox could not start",
        `The local app server could not start on port ${PORT}. Close the program using that port and try again.\n\n${error.message}`
      );
      app.quit();
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  app.on("before-quit", () => {
    if (server) server.close();
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}

function startLocalServer() {
  return new Promise((resolve, reject) => {
    server = http.createServer((request, response) => {
      const requestUrl = new URL(request.url, `http://${HOST}:${PORT}`);
      if (request.method !== "GET" || !["/", "/playlist.html"].includes(requestUrl.pathname)) {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Not found");
        return;
      }

      if (requestUrl.pathname === "/") {
        response.writeHead(302, { Location: "/playlist.html" });
        response.end();
        return;
      }

      fs.readFile(PLAYLIST_FILE, (error, contents) => {
        if (error) {
          response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
          response.end("Could not load Jukebox.");
          return;
        }
        response.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
          "Referrer-Policy": "origin",
          "X-Content-Type-Options": "nosniff"
        });
        response.end(contents);
      });
    });

    server.once("error", reject);
    server.listen(PORT, HOST, resolve);
  });
}

async function createWindow() {
  if (mainWindow) {
    mainWindow.focus();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 1180,
    height: 820,
    minWidth: 360,
    minHeight: 560,
    backgroundColor: "#f5f8ef",
    title: "Jukebox",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (["https:", "http:"].includes(new URL(url).protocol)) shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (new URL(url).origin !== `http://${HOST}:${PORT}`) event.preventDefault();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  await mainWindow.loadURL(APP_URL);
}