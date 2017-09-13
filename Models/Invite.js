const crypto = require('../cryptUtils.js');
const conf = require('../conf.js')

function Invite(sender,room,password) {
    this.sender = sender;
    this.content = {name:room,password:password}
    this.timeStamp = Math.floor(Date.now() / 1000);
}

module.exports = Invite;