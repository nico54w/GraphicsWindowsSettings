const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const extra = require('./mimi');
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, './app/preload.js')
    },
    autoHideMenuBar: true
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, './app/index.html'));
  ipcMain.on('get-process-values', function() {
    extra.getProcess(function(result) {
      mainWindow.webContents.send('set-process-values', result);
    });
  });
  ipcMain.on('get-current-values', function() {
    extra.getValues(function(result) {
      mainWindow.webContents.send('set-current-values', result);
    });
  });
  ipcMain.on('set-new-value', function(event, obj){
    extra.setNewValue(obj, function(error, out){
      mainWindow.webContents.send('confirmation', out)
    });
  });
  ipcMain.on('remove-value', function(event, key){
    extra.removeValue(key, function(error, out){
      mainWindow.webContents.send('confirmation', out);
    });
  });
  ipcMain.on('open-from-file', function(event){
    let result = dialog.showOpenDialogSync(mainWindow, {
      properties: ['openFile'],
      filters: [
        {name: 'EXE', extensions: ['exe']}
      ]
    });
    if(result != undefined){
      let obj = {
        Path: result[0],
        Value: 'GpuPreference=0;'
      }
      extra.setNewValue(obj, function(error, out){
        mainWindow.webContents.send('confirmation', out);
      })
    }
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
let win = null;
app.on('ready', function(){
  win = createWindow()
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
