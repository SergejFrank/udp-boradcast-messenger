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


ChatRoom.prototype.getHash = function () {
    let iv = new Buffer.alloc(16); // fill with zeros

console.log(this.getPasswordSHA256Base64());
    return null;
    let cipher = crypto.createCipheriv('aes-256-cbc', this.getPasswordSHA256Base64(), iv);

    var crypted = cipher.update(this.getNameBase64(),'base64','base64');
    crypted += cipher.final('base64');
    return crypted;
}

module.exports = ChatRoom;
