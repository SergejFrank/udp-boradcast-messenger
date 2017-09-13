const crypto = require('../cryptUtils.js');
const conf = require('../conf.js')

function KeepAlive(sender) {
    this.sender = sender;
    this.timeStamp = Math.floor(Date.now() / 1000);
}

KeepAlive.prototype.getAsBase64 = function(){
    return new Buffer(JSON.stringify(this)).toString('base64');
}

KeepAlive.prototype.sign = function(){
    return crypto.sign(this.getAsBase64(), conf.key);
}

KeepAlive.prototype.isOnline = function(){
    return this.offlineSince() < 10;
}

KeepAlive.prototype.offlineSince = function(){
    return Math.floor(Date.now() / 1000) - this.timeStamp;
}


KeepAlive.prototype.getDate = function(){
    return date = new Date(this.timeStamp*1000).toISOString();
}

module.exports = KeepAlive;