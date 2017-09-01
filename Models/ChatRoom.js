var crypto = require('crypto');
var {aesEncrypt,hashSha256,aesDecrypt} = require('../cryptUtils.js');

function ChatRoom() {}

ChatRoom.prototype.getIdentifier = function (name,password) {
    return aesEncrypt(this.name,hashSha256(this.password));
}


ChatRoom.prototype.getRoomName = function (identifier,password) {
    var pwHash = hashSha256(password);
    return aesDecrypt(identifier,pwHash);
}


module.exports = ChatRoom;