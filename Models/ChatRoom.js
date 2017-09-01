var crypto = require('crypto');



function ChatRoom(name,password) {
    this.name = name;
    this.password = password
}


ChatRoom.prototype.getNameBase64 = function () {
    return new Buffer(this.name).toString('base64');
};

ChatRoom.prototype.getPasswordSHA256Base64 = function () {
    return crypto.createHash('sha256').update(this.password, 'utf8').digest('hex').toUpperCase();
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
