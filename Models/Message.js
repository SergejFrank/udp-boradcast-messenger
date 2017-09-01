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
    var message = this.getAsBase64();
    console.log('message: ' + message);
    console.log(conf.key);
    var signed = crypto.sign(message, conf.key);
    console.log('signed: ' + signed);
    return signed;
}

module.exports = Message;
