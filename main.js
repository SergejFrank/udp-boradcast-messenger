const {app, BrowserWindow, ipcMain, dialog, session} = require('electron')
const path = require('path')
const url = require('url')
const Message = require('./Models/Message.js');
const Sender = require('./Models/Sender.js')
const Content = require('./Models/Content.js')
const Packet = require('./Models/Packet.js')
const KeepAlive = require('./Models/KeepAlive.js')
const ChatRoom = require('./Models/ChatRoom.js');
const RoomList = require("./RoomList.js")
const UserList = require("./UserList.js")
const {broadcast} = require('./client');
const Server = require('./server');
const conf = require('./conf');
const crypto = require('./cryptUtils.js')
const JoinedRooms = new RoomList();
const userList = new UserList();


global.joinedRooms = JoinedRooms;
global.userList = userList;

var knowMessages = new Map();


function isKnownMessage(id) {
    return knowMessages.has(id);
}

function addKnownMessage(id) {
    knowMessages.set(id, true);
}

function handleJoin(name, password) {
    JoinedRooms.addRoom(new ChatRoom(name,password));
}

function handleCommand(msg) {
    var params = msg.split(" ");
    switch (params[0]) {
        case "/join":
            if (params.length == 3) {
                handleJoin(params[1], params[2]);
            }
            break;
    }
}


function handleMessage(msg) {
    var json = JSON.parse(msg.substr(4));
    if (isKnownMessage(json.id)) {
        return;
    } else {
        addKnownMessage(json.id);
    }
    switch (json.type) {
        case "PublicMessage":
            handlePublic(json);
            break;
        case "PrivateMessage":
            //TODO private
            break;
        case "KeepAlive":
            handleKeepAlive(json)
            break;
    }

}


function handlePublic(json) {

    var chatRoom = new ChatRoom();
    var room = joinedRooms.findRoom(json.chatRoom);
    if (room == null) return;
    var content = JSON.parse(crypto.aesDecrypt(json.content, crypto.hashSha256(room.password)))
    var data = validateData(content);
    if (data == null) return;
    room.id = room.getId();
    data.uuid = crypto.hashSha256(data.sender.publicKey);

    win.webContents.send("message", {room: room, data: data, self: data.sender.publicKey == conf.getPublicKey()});
}

function handleKeepAlive(json) {
    var signedData = JSON.parse(new Buffer(json.content, "base64").toString());
    var keepAlive = validateData(signedData);

    var sender = new Sender();
    sender.setName(keepAlive.sender.name);
    sender.setPublicKey(keepAlive.sender.publicKey);

    var newKeepAlive = new KeepAlive(sender);

    userList.add(newKeepAlive);
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
    win.webContents.openDevTools();

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



setInterval(() => {
    var sender = new Sender();
    var keepAlive = new KeepAlive(sender);

    var content = new Content(keepAlive);
    var packet = new Packet("KeepAlive", null, content.getAsBase64())
    broadcast("FLEX" + JSON.stringify(packet));
}, 1000)



// SERVER
Server.on('message', function (message, remote) {
    var msg = message.toString();

    if (msg.substr(0, 4) == "FLEX") {
        handleMessage(msg)
    } else {
        console.log(msg);
    }
});



ipcMain.on('send', (event, arg) => {
    if (arg.msg.substr(0, 1) == "/") {
        handleCommand(arg.msg);
        return;
    }

    var activeRoom = JoinedRooms.getActiveRoom();
    var chatIdentifier = activeRoom.getIdentifier();
    var sender = new Sender();
    var msg = new Message(sender, arg.msg);
    var content = new Content(msg);
    var packet = new Packet("PublicMessage", chatIdentifier, crypto.aesEncrypt(JSON.stringify(content), crypto.hashSha256(activeRoom.password)))
    broadcast("FLEX" + JSON.stringify(packet));
});