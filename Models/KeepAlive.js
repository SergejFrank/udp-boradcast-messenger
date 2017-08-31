const conf = require('./conf');


function KeepAlive(sender) {
    this.sender = sender;
    this.timeStamp = Math.floor(Date.now() / 1000);
}


module.exports = KeepAlive;