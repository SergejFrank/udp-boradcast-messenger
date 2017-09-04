const crypto = require('../cryptUtils.js');

const conf = require('../conf.js')

function Message(sender,content) {
    this.sender = sender;
    this.content = content;
    this.timeStamp = 1000
    //this.timeStamp = Math.floor(Date.now() / 1000);
}

Message.prototype.getAsBase64 = function(){
  console.log(JSON.stringify(this));
  return new Buffer(JSON.stringify(this)).toString('base64');
}

Message.prototype.sign = function(){
    return crypto.sign(this.getAsBase64(), conf.key);
}

module.exports = Message;
