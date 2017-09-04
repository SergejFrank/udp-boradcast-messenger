const {app, BrowserWindow, ipcMain, dialog, session} = require('electron')
const path = require('path')
const url = require('url')
const Message = require('./Models/Message.js');
const Sender = require('./Models/Sender.js')
const Content = require('./Models/Content.js')
const Packet = require('./Models/Packet.js')
const client = require('./client');
const server = require('./server');
const conf = require('./conf');
const crypto = require('./cryptUtils.js')
const {filetransfer} = require('./file-transfer');
var {aesEncrypt, hashSha256, aesDecrypt} = require('./cryptUtils.js');

var ChatRoom = require('./Models/ChatRoom.js');
var broadcast = client.broadcast;

var joinedRooms = new Map();
joinedRooms.set("Public","Public");

var knowMessages = new Map();


function isKnownMessage(id){
    return knowMessages.has(id);
}

function addKnownMessage(id){
    knowMessages.set(id,true);
}

function handleJoin(name,password){
    joinedRooms.set(password,name);
}

function handleCommand(msg){
    var params = msg.split(" ");
    switch (params[0]){
        case "/join":
            if(params.length == 3){
                handleJoin(params[1],params[2]);
            }
            break;
    }
    console.log(params);
}


function handleMessage(msg) {
    var json = JSON.parse(msg.substr(4));
    if(isKnownMessage(json.id)){
        console.log("already known")
        return;
    }else{
        addKnownMessage(json.id);
    }
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

function findMatchingRoom(identifier){
    var chatRoom = new ChatRoom();
    var found = null;
    joinedRooms.forEach(function(password,name){
        try{
            var room = chatRoom.getRoomName(identifier,password)
            if(room == name){
                found = {name: name, password: password};
            }
        }catch (e){}
    })
    return found;
}



function handlePublic(json) {

    var chatRoom = new ChatRoom();
    var room = findMatchingRoom(json.chatRoom);
    if(room == null) return;
    var content = JSON.parse(aesDecrypt(json.content, hashSha256(room.password)))
    var data = validateData(content);
    if (data == null) return;

    win.webContents.send("message", {room:room.name, data: data});
}

function handleKeepAlive(json) {
  var signedData = JSON.parse(new Buffer(json.Content, "base64").toString());
  var keepAlive = validateData(signedData);
}

function handlePrivateMessage(json) {
  var aesKey = crypto.rsaDecryptWithPrivate(json.aesKey, conf.key);
  var decrypted = crypto.aesDecrypt(json.content, aesKey);

  var privateMessage = validateData(decrypted);
}

function validateData(toValidate) {
    var data = JSON.parse(new Buffer(toValidate.data, "Base64").toString());
    var validated = crypto.validate(toValidate.data, toValidate.signature, data.sender.publicKey);
    return validated ? data : null;
}

function createWindow() {
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

    setTimeout(function () {
        win.webContents.send("conf", conf);
    }, 500);


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
    if (msg.substr(0, 4) == "FLEX") {
        handleMessage(msg)
    }

});

ipcMain.on('send', (event, arg) => {
    if(arg.msg.substr(0,1) == "/"){
        handleCommand(arg.msg);
        return;
    }

    var chat = new ChatRoom();
    var chatIdentifier = chat.getIdentifier("Public", "Public")
    var sender = new Sender();
    var msg = new Message(sender, arg.msg);
    var content = new Content(msg);
    console.log(content)
    var packet = new Packet("PublicMessage", chatIdentifier, aesEncrypt(JSON.stringify(content),hashSha256("Public")))
    console.log(packet)
    console.log(hashSha256("Public"))
    broadcast("FLEX"+JSON.stringify(packet));

    console.log(arg);
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