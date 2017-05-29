const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path')
const url = require('url')
const message = require('./message');
const client = require('./client');
const server = require('./server');
const conf = require('./conf');

let broadcast = client.broadcast;
let win;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600});
  win.setMenu(null);
  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  //win.webContents.openDevTools();

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});



app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
});


// SERVER
server.server.on('message', function (message, remote) {
  var msg = JSON.parse(message);
  if(conf.uuid != msg.id){
    win.webContents.send(msg.type, msg);
  }
  if(msg.type == "keepalive"){
    msg.ip = remote.address;
    win.webContents.send(msg.type, msg);
  }
});

server.server.on('error',function(err){

  if(err.code == "EADDRINUSE"){
    setTimeout(function(){
      aboutDialogOptions = {
        type: "error",
        title: "Error",
        buttons: ["Ok"],
        message: "Port already in use",
        detail: "Port: "+conf.port
      };

      dialog.showMessageBox(win, aboutDialogOptions,function(){
        //app.quit()
      });
    },100)
  }

});

// CLIENT
ipcMain.on('send', (event, arg)=> {
  let msg = message.Message;
  msg.text = arg.msg;
  broadcast(msg);
});