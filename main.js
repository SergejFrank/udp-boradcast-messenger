const {app, BrowserWindow, ipcMain, dialog, session} = require('electron')
const path = require('path')
const url = require('url')
const message = require('./Models/Message.js');
const Sender = require('./Models/Sender.js')
const client = require('./client');
const server = require('./server');
const conf = require('./conf');
const crypto = require('./cryptUtils.js')
const {filetransfer} = require('./file-transfer');
var {aesEncrypt,hashSha256,aesDecrypt} = require('./cryptUtils.js');

var ChatRoom = require('./Models/ChatRoom.js');

var room = new ChatRoom();

//console.log(room.getHash());

function handleMessage(msg){
    var json = JSON.parse(msg.substr(4));
    console.log(json);
    switch (json.type) {
        case "PublicMessage":
            handlePublic(json);
            break;
        case "PrivateMessage":
          //TODO private
            break;
        case "KeepAlive":
          //TODO keepalive
            break;
    }

}

function handlePublic(json){
    var chatRoom = room.getRoomName(json.chatRoom,"Public");
    var content = JSON.parse(aesDecrypt(json.content,hashSha256("Public")))
    var data = validateData(content);
    if(data == null) return;

    win.webContents.send("message", data);
}

function validateData(toValidate) {
  var data = JSON.parse(new Buffer(toValidate.data,"Base64").toString());
  var validated = crypto.validate(toValidate.data,toValidate.signature,data.sender.publicKey);
  return validated ? data : null;
}

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
  win.webContents.openDevTools();

  setTimeout(function(){
    win.webContents.send("conf", conf);
  },500);


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
  var msg = message.toString();
  if(msg.substr(0,4) == "FLEX"){
    handleMessage(msg)
  }

  /*var msg = JSON.parse(message);
  msg.ip = remote.address;

  if(msg.type != "message"){
    win.webContents.send(msg.type, msg);
  }else if(conf.uuid != msg.id){
    win.webContents.send(msg.type, msg);
  }*/

});



/*
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




ipcMain.on('file', (event, arg)=> {
  filetransfer.fileUpload(arg.path,function(fileData){
    let msg = message.File;
    msg.fileId = fileData.id;
    msg.port = fileData.port;
    msg.fileName = fileData.name;
    broadcast(msg);
  });
});
*/