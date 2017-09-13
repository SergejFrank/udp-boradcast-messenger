var crypto = require('crypto');
var {aesEncrypt,hashSha256,aesDecrypt} = require('../cryptUtils.js');

function ChatRoom(name,password){
    this.name = name;
    this.password = password;
    this.identifier = this.getIdentifier();
}

ChatRoom.prototype.getIdentifier = function () {
    return aesEncrypt(this.name,hashSha256(this.password));
}

ChatRoom.prototype.getRoomName = function (identifier,password) {
    var pwHash = hashSha256(password);
    return aesDecrypt(identifier,pwHash);
}

ChatRoom.prototype.getId = function () {
    return hashSha256(this.name+this.password);
}

module.exports = ChatRoom;
